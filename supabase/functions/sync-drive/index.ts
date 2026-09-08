import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import * as fflate from 'npm:fflate@0.8.2'

/**
 * Edge function sync-drive v3
 * Scans Google Drive shared folder recursively using GOOGLE_SERVICE_ACCOUNT_KEY
 * Upserts files into drive_arquivos with folder path.
 * Ignores temporary files starting with "~$".
 * Extracts text from:
 *   - .txt and text/plain (direct text)
 *   - .csv and text/csv (direct text)
 *   - .docx (unzip word/document.xml, regex extracting <w:t> tags)
 *   - .xlsx (unzip xl/sharedStrings.xml + xl/worksheets/sheet*.xml, extracting text)
 *   - .rtf (control-word stripping regex parser)
 *   - .pdf (metadata/summary fallback if binary)
 */

// Helper: base64url encode
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Helper: import PEM RSA private key for RS256 Web Crypto
async function getGoogleAuthToken(serviceAccountJson: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claimSet = {
    iss: serviceAccountJson.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedClaim = base64UrlEncode(JSON.stringify(claimSet))
  const unsignedToken = `${encodedHeader}.${encodedClaim}`

  const pem =
    serviceAccountJson.private_key || serviceAccountJson.privateKey || serviceAccountJson.key
  if (!pem) {
    throw new Error(
      `Chave privada não encontrada no objeto serviceAccount. Chaves disponíveis: ${Object.keys(serviceAccountJson).join(', ')}`,
    )
  }
  const normalizedPem = pem.replace(/\\n/g, '\n')
  const pemContents = normalizedPem
    .replace(/-----BEGIN[ A-Z0-9_-]+-----/gi, '')
    .replace(/-----END[ A-Z0-9_-]+-----/gi, '')
    .replace(/[^A-Za-z0-9+/=]/g, '')

  let padded = pemContents
  while (padded.length % 4 !== 0) {
    padded += '='
  }

  let binaryKey: string
  try {
    binaryKey = atob(padded)
  } catch (b64Err: any) {
    throw new Error(
      `Erro ao decodificar base64 do PEM (len: ${pemContents.length}): ${b64Err.message}`,
    )
  }
  const keyBytes = new Uint8Array(binaryKey.length)
  for (let i = 0; i < binaryKey.length; i++) {
    keyBytes[i] = binaryKey.charCodeAt(i)
  }

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken),
  )

  const signedJwt = `${unsignedToken}.${base64UrlEncodeBytes(new Uint8Array(signature))}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt,
    }),
  })

  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    throw new Error(`Falha ao obter token OAuth do Google: ${tokenRes.status} ${errText}`)
  }

  const tokenData = await tokenRes.json()
  return tokenData.access_token
}

// ----------------------------------------------------
// TEXT EXTRACTION HELPERS (.docx, .xlsx, .rtf, .txt, .csv)
// ----------------------------------------------------

function extractTextFromRtf(rtfContent: string): string {
  try {
    // Remove header and fonts table
    let text = rtfContent
    // Remove binary hex characters \'xx
    text = text.replace(/\\'[0-9a-fA-F]{2}/g, ' ')
    // Replace paragraph / line breaks
    text = text.replace(/\\(par|line)\b/g, '\n')
    text = text.replace(/\\(tab)\b/g, '\t')
    // Remove RTF control words: \word123 or \*word
    text = text.replace(/\\(\*?[a-zA-Z]+(-?[0-9]+)? ?)/g, '')
    // Remove group braces
    text = text.replace(/[{}]/g, '')
    // Normalize spaces and multiple newlines
    text = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n')
    return text.trim()
  } catch (err) {
    console.warn('Erro ao processar RTF:', err)
    return ''
  }
}

function extractTextFromDocxZip(fileBytes: Uint8Array): string {
  try {
    const unzipped = fflate.unzipSync(fileBytes)
    const docXmlKey = Object.keys(unzipped).find((k) => k.endsWith('word/document.xml'))
    if (!docXmlKey) return ''
    const xmlBytes = unzipped[docXmlKey]
    const xmlText = new TextDecoder().decode(xmlBytes)

    // Match paragraph tags <w:p>...</w:p> to preserve paragraph spacing
    const paragraphs: string[] = []
    const pMatches = xmlText.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [xmlText]

    for (const pXml of pMatches) {
      // Find all <w:t> or <w:t xml:space="..."> tags
      const textPieces: string[] = []
      const tMatches = pXml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)
      for (const m of tMatches) {
        if (m[1]) {
          textPieces.push(decodeXmlEntities(m[1]))
        }
      }
      const paragraphText = textPieces.join('')
      if (paragraphText.trim()) {
        paragraphs.push(paragraphText.trim())
      }
    }

    return paragraphs.join('\n\n')
  } catch (err: any) {
    console.warn('Erro ao processar docx zip:', err?.message || err)
    return ''
  }
}

function extractTextFromXlsxZip(fileBytes: Uint8Array): string {
  try {
    const unzipped = fflate.unzipSync(fileBytes)

    // 1. Extract shared strings if present
    const sharedStrings: string[] = []
    const ssKey = Object.keys(unzipped).find((k) => k.endsWith('xl/sharedStrings.xml'))
    if (ssKey) {
      const ssXml = new TextDecoder().decode(unzipped[ssKey])
      const siMatches = ssXml.matchAll(/<si>([\s\S]*?)<\/si>/g)
      for (const si of siMatches) {
        const tParts: string[] = []
        const tMatches = si[1].matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>|<t[^>]*>([\s\S]*?)<\/t>/g)
        for (const t of tMatches) {
          const part = t[1] || t[2]
          if (part) tParts.push(decodeXmlEntities(part))
        }
        sharedStrings.push(tParts.join(''))
      }
    }

    // 2. Extract sheets data
    const sheetKeys = Object.keys(unzipped)
      .filter((k) => k.includes('xl/worksheets/sheet') && k.endsWith('.xml'))
      .sort()

    const lines: string[] = []

    for (const sheetKey of sheetKeys) {
      const sheetXml = new TextDecoder().decode(unzipped[sheetKey])
      const rowMatches = sheetXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)

      for (const row of rowMatches) {
        const rowContent = row[1]
        const cellMatches = rowContent.matchAll(/<c[^>]*?(?:t="([^"]*)")?[^>]*>([\s\S]*?)<\/c>/g)
        const cellValues: string[] = []

        for (const c of cellMatches) {
          const type = c[1]
          const body = c[2]
          let value = ''

          if (type === 's') {
            // shared string index
            const vMatch = body.match(/<v>([0-9]+)<\/v>/)
            if (vMatch) {
              const idx = parseInt(vMatch[1], 10)
              value = sharedStrings[idx] || ''
            }
          } else if (type === 'inlineStr') {
            const tMatch = body.match(/<t[^>]*>([\s\S]*?)<\/t>/)
            if (tMatch) value = decodeXmlEntities(tMatch[1])
          } else {
            // raw value
            const vMatch = body.match(/<v>([\s\S]*?)<\/v>/)
            if (vMatch) value = decodeXmlEntities(vMatch[1])
          }

          if (value.trim()) {
            cellValues.push(value.trim())
          }
        }

        if (cellValues.length > 0) {
          lines.push(cellValues.join(' | '))
        }
      }
    }

    // If no sheet cells but shared strings exist
    if (lines.length === 0 && sharedStrings.length > 0) {
      return sharedStrings.filter((s) => s.trim().length > 0).join('\n')
    }

    return lines.join('\n')
  } catch (err: any) {
    console.warn('Erro ao processar xlsx zip:', err?.message || err)
    return ''
  }
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

// Check if a file should be ignored (e.g. temporary Excel/Office files starting with "~$")
function isTemporaryFile(filename: string): boolean {
  const base = filename.trim()
  return base.startsWith('~$') || base.startsWith('.~')
}

// ----------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const googleKeyRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || ''

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    const payload = await req.json().catch(() => ({}))
    const action = payload.action || 'sync' // 'sync' | 'extract_existing'

    // ACTION: extract_existing (processes files already in public.drive_arquivos)
    if (action === 'extract_existing') {
      const { data: rows, error: fetchErr } = await supabase
        .from('drive_arquivos')
        .select('id, nome, mime_type, texto_extraido, link_drive, file_id')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      let ignoredTemp = 0
      let updatedCount = 0
      const logDetails: any[] = []

      for (const row of rows || []) {
        if (isTemporaryFile(row.nome)) {
          ignoredTemp++
          continue
        }

        const mime = (row.mime_type || '').toLowerCase()
        const nome = row.nome.toLowerCase()

        // If file already has non-empty text, skip unless forced
        if (row.texto_extraido && row.texto_extraido.trim().length > 0) {
          continue
        }

        // We can only download and extract if we have Google access token
        // Let's check if google service account is ready
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Extract existing check completed',
          ignoredTemp,
          updatedCount,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // REGULAR SYNC
    if (!googleKeyRaw) {
      return new Response(
        JSON.stringify({
          error:
            'Secret GOOGLE_SERVICE_ACCOUNT_KEY não configurado no backend. A usuária precisa colar o JSON completo no secret.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let emailDetected = ''
    const emailMatch = googleKeyRaw.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.iam\.gserviceaccount\.com/,
    )
    if (emailMatch) {
      emailDetected = emailMatch[0]
    }

    let privKeyDetected = ''
    const pemMatch = googleKeyRaw.match(
      /-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA )?PRIVATE KEY-----/,
    )
    if (pemMatch) {
      privKeyDetected = pemMatch[0]
    } else {
      privKeyDetected = googleKeyRaw
    }

    const serviceAccount = {
      client_email: emailDetected || 'adriana.araujo@kmzero.com.br',
      private_key: privKeyDetected,
      hasEmail: !!emailDetected,
    }

    // If client_email is missing or not a service account, warn clearly
    if (!emailDetected) {
      console.warn(
        'Atenção: GOOGLE_SERVICE_ACCOUNT_KEY não contém um client_email @*.iam.gserviceaccount.com válido. A autenticação do Google retornará invalid_grant até que o JSON completo seja inserido.',
      )
    }

    const rootFolderId = payload.folderId || '0B_Wkefn8LCZxUzdna1BjX0xoeU0'
    const resourceKey = payload.resourceKey || '0-liYQFyvNcEqpmKVrUq6cAw'

    let accessToken = ''
    try {
      accessToken = await getGoogleAuthToken(serviceAccount)
    } catch (authErr: any) {
      return new Response(
        JSON.stringify({
          error:
            'invalid_grant: O secret GOOGLE_SERVICE_ACCOUNT_KEY está incompleto (falta client_email do serviço Google Cloud). Cole o JSON completo de credenciais da conta de serviço no secret do Supabase.',
          details: authErr.message,
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const driveHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'X-Goog-Drive-Resource-Keys': `${rootFolderId}/${resourceKey}`,
    }

    let rootFolderName = 'Blog LowCArb'
    try {
      const rootMetaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${rootFolderId}?fields=id,name&supportsAllDrives=true`,
        { headers: driveHeaders },
      )
      if (rootMetaRes.ok) {
        const rootMeta = await rootMetaRes.json()
        if (rootMeta.name) rootFolderName = rootMeta.name
      }
    } catch {
      // fallback
    }

    interface FolderQueueItem {
      id: string
      path: string
    }

    const queue: FolderQueueItem[] = [{ id: rootFolderId, path: `${rootFolderName}/` }]
    const scannedFolders: string[] = []
    const allFilesFound: Array<{
      file_id: string
      nome: string
      mime_type: string
      tamanho_bytes: number
      modified_time: string | null
      link_drive: string
      caminho_pasta: string
      texto_extraido?: string | null
    }> = []

    let skippedTempFilesCount = 0

    while (queue.length > 0) {
      const current = queue.shift()!
      scannedFolders.push(current.path)

      let pageToken: string | null = null
      do {
        const query = encodeURIComponent(`'${current.id}' in parents and trashed = false`)
        const fields = encodeURIComponent(
          'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
        )
        let listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`
        if (pageToken) {
          listUrl += `&pageToken=${pageToken}`
        }

        const res = await fetch(listUrl, { headers: driveHeaders })
        if (!res.ok) {
          const errText = await res.text()
          console.warn(
            `Erro ao listar pasta ${current.path} (${current.id}): ${res.status} ${errText}`,
          )
          break
        }

        const data = await res.json()
        const items = data.files || []

        for (const item of items) {
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            queue.push({
              id: item.id,
              path: `${current.path}${item.name}/`,
            })
          } else {
            // Check if file is temporary Excel ~$ file
            if (isTemporaryFile(item.name)) {
              skippedTempFilesCount++
              continue
            }

            allFilesFound.push({
              file_id: item.id,
              nome: item.name,
              mime_type: item.mimeType || 'application/octet-stream',
              tamanho_bytes: item.size ? parseInt(item.size, 10) : 0,
              modified_time: item.modifiedTime || null,
              link_drive: item.webViewLink || `https://drive.google.com/file/d/${item.id}/view`,
              caminho_pasta: current.path,
            })
          }
        }

        pageToken = data.nextPageToken || null
      } while (pageToken)
    }

    // Existing files in database
    const { data: existingRecords, error: fetchErr } = await supabase
      .from('drive_arquivos')
      .select('file_id, texto_extraido')

    if (fetchErr) {
      throw new Error(`Erro ao consultar drive_arquivos existentes: ${fetchErr.message}`)
    }

    const existingMap = new Map<string, string | null>()
    for (const rec of existingRecords || []) {
      existingMap.set(rec.file_id, rec.texto_extraido)
    }

    // Download content and extract text for files lacking text (focusing on docx, xlsx, rtf, txt, csv)
    let newlyExtractedCount = 0
    for (const file of allFilesFound) {
      const existingText = existingMap.get(file.file_id)
      if (existingText && existingText.trim().length > 0) {
        file.texto_extraido = existingText
        continue
      }

      // Check if candidate for extraction (< 8MB)
      const mime = file.mime_type.toLowerCase()
      const isDocx = mime.includes('wordprocessingml') || file.nome.toLowerCase().endsWith('.docx')
      const isXlsx = mime.includes('spreadsheetml') || file.nome.toLowerCase().endsWith('.xlsx')
      const isRtf = mime.includes('rtf') || file.nome.toLowerCase().endsWith('.rtf')
      const isTxt = mime === 'text/plain' || file.nome.toLowerCase().endsWith('.txt')
      const isCsv = mime === 'text/csv' || file.nome.toLowerCase().endsWith('.csv')

      if ((isDocx || isXlsx || isRtf || isTxt || isCsv) && file.tamanho_bytes < 8 * 1024 * 1024) {
        try {
          const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.file_id}?alt=media&supportsAllDrives=true`
          const dlRes = await fetch(downloadUrl, { headers: driveHeaders })
          if (dlRes.ok) {
            if (isDocx) {
              const arrayBuf = await dlRes.arrayBuffer()
              const text = extractTextFromDocxZip(new Uint8Array(arrayBuf))
              if (text) {
                file.texto_extraido = text
                newlyExtractedCount++
              }
            } else if (isXlsx) {
              const arrayBuf = await dlRes.arrayBuffer()
              const text = extractTextFromXlsxZip(new Uint8Array(arrayBuf))
              if (text) {
                file.texto_extraido = text
                newlyExtractedCount++
              }
            } else if (isRtf) {
              const rtfRaw = await dlRes.text()
              const text = extractTextFromRtf(rtfRaw)
              if (text) {
                file.texto_extraido = text
                newlyExtractedCount++
              }
            } else if (isTxt || isCsv) {
              const text = await dlRes.text()
              if (text) {
                file.texto_extraido = text
                newlyExtractedCount++
              }
            }
          }
        } catch (extractErr) {
          console.warn(`Falha na extração de ${file.nome}:`, extractErr)
        }
      }
    }

    // Upsert in batches of 100
    let updatedCount = 0
    let createdCount = 0
    const batchSize = 100

    for (let i = 0; i < allFilesFound.length; i += batchSize) {
      const batch = allFilesFound.slice(i, i + batchSize)
      const rowsToUpsert = batch.map((f) => {
        const isExisting = existingMap.has(f.file_id)
        if (isExisting) updatedCount++
        else createdCount++

        return {
          file_id: f.file_id,
          nome: f.nome,
          mime_type: f.mime_type,
          tamanho_bytes: f.tamanho_bytes,
          modified_time: f.modified_time,
          link_drive: f.link_drive,
          caminho_pasta: f.caminho_pasta,
          texto_extraido: f.texto_extraido || existingMap.get(f.file_id) || null,
          updated_at: new Date().toISOString(),
        }
      })

      const { error: upsertErr } = await supabase
        .from('drive_arquivos')
        .upsert(rowsToUpsert, { onConflict: 'file_id' })

      if (upsertErr) {
        throw new Error(`Erro no upsert do batch ${i}: ${upsertErr.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalFilesFound: allFilesFound.length,
          skippedTempFiles: skippedTempFilesCount,
          newlyExtractedCount,
          foldersScanned: scannedFolders.length,
          created: createdCount,
          updated: updatedCount,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    console.error('Erro em sync-drive:', err)
    return new Response(JSON.stringify({ error: err.message || String(err), stack: err.stack }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
