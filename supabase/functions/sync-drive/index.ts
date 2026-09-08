import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import * as fflate from 'npm:fflate@0.8.2'

/**
 * Edge function sync-drive v4 (incremental / batch processing)
 * Scans Google Drive shared folder recursively using GOOGLE_SERVICE_ACCOUNT_KEY.
 *
 * To avoid HTTP 504 idle timeouts (150s), this function supports batch execution:
 * - Scans folder tree and upserts all discovered metadata in small db batches.
 * - Extracts text from .docx, .xlsx, .rtf, .txt, .csv incrementally.
 * - If time elapsed approaches TIME_BUDGET_MS (~70s) or extraction batch limit is reached,
 *   it returns { status: "in_progress", processados, restantes, total, stats, cursor }
 *   allowing the frontend to loop until { status: "completed" }.
 * - Fully idempotent: upserts into drive_arquivos based on unique file_id.
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
    let text = rtfContent
    text = text.replace(/\\'[0-9a-fA-F]{2}/g, ' ')
    text = text.replace(/\\(par|line)\b/g, '\n')
    text = text.replace(/\\(tab)\b/g, '\t')
    text = text.replace(/\\(\*?[a-zA-Z]+(-?[0-9]+)? ?)/g, '')
    text = text.replace(/[{}]/g, '')
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

    const paragraphs: string[] = []
    const pMatches = xmlText.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [xmlText]

    for (const pXml of pMatches) {
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
            const vMatch = body.match(/<v>([0-9]+)<\/v>/)
            if (vMatch) {
              const idx = parseInt(vMatch[1], 10)
              value = sharedStrings[idx] || ''
            }
          } else if (type === 'inlineStr') {
            const tMatch = body.match(/<t[^>]*>([\s\S]*?)<\/t>/)
            if (tMatch) value = decodeXmlEntities(tMatch[1])
          } else {
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

// Check if a file should be ignored (e.g. temporary Excel/Office files starting with "~$" or ".~")
function isTemporaryFile(filename: string): boolean {
  const base = filename.trim()
  return base.startsWith('~$') || base.startsWith('.~')
}

// ----------------------------------------------------
// CREDENTIAL RESOLVER (Multi-source fallback)
// ----------------------------------------------------

function resolveServiceAccount(): { email: string; privateKey: string } | null {
  const googleKeyRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || ''
  const dedicatedClientEmail =
    Deno.env.get('GOOGLE_CLIENTE_EMAIL') || Deno.env.get('GOOGLE_CLIENT_EMAIL') || ''

  if (!googleKeyRaw && !dedicatedClientEmail) {
    return null
  }

  let parsedKey: any = null
  try {
    parsedKey = JSON.parse(googleKeyRaw)
  } catch {
    // not raw JSON
  }

  let emailDetected = parsedKey?.client_email || ''
  if (!emailDetected) {
    const emailMatch = googleKeyRaw.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.iam\.gserviceaccount\.com/,
    )
    if (emailMatch) emailDetected = emailMatch[0]
  }
  if (!emailDetected && dedicatedClientEmail) {
    emailDetected = dedicatedClientEmail.trim()
  }

  let privKeyDetected = parsedKey?.private_key || ''
  if (!privKeyDetected) {
    const pemMatch = googleKeyRaw.match(
      /-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA )?PRIVATE KEY-----/,
    )
    if (pemMatch) {
      privKeyDetected = pemMatch[0]
    } else {
      privKeyDetected = googleKeyRaw
    }
  }

  if (!emailDetected || !privKeyDetected) {
    return null
  }

  return { email: emailDetected, privateKey: privKeyDetected }
}

// ----------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------

// Idle timeout is 150s. We stay well within safety margins: stop after ~65s per invocation.
const TIME_BUDGET_MS = 65_000
const MAX_EXTRACTIONS_PER_BATCH = 15

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    const payload = await req.json().catch(() => ({}))
    const action = payload.action || 'sync' // 'sync' | 'extract_batch' | 'test_auth'
    const step = payload.step || (action === 'extract_batch' ? 'extract' : 'scan')
    const batchOffset = typeof payload.offset === 'number' ? payload.offset : 0
    const accumulatedStats = payload.stats || {
      totalFound: 0,
      newlyExtracted: 0,
      alreadyWithText: 0,
      skippedTemp: 0,
      foldersScanned: 0,
      created: 0,
      updated: 0,
    }

    // RESOLVE CREDENTIALS
    const creds = resolveServiceAccount()
    if (!creds) {
      const googleKeyRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || ''
      const dedicatedClientEmail =
        Deno.env.get('GOOGLE_CLIENTE_EMAIL') || Deno.env.get('GOOGLE_CLIENT_EMAIL') || ''
      return new Response(
        JSON.stringify({
          error:
            'Secret GOOGLE_SERVICE_ACCOUNT_KEY incompleto ou não configurado. Verifique o JSON da conta de serviço e o e-mail.',
          hasKey: !!googleKeyRaw,
          hasEmail: !!dedicatedClientEmail,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const serviceAccount = {
      client_email: creds.email,
      private_key: creds.privateKey,
    }

    // ACTION: test_auth
    if (action === 'test_auth') {
      try {
        const token = await getGoogleAuthToken(serviceAccount)
        return new Response(
          JSON.stringify({
            success: true,
            email: creds.email,
            tokenObtained: !!token,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            success: false,
            error: err.message,
            emailDetected: creds.email,
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // AUTH TOKEN
    let accessToken = ''
    try {
      accessToken = await getGoogleAuthToken(serviceAccount)
    } catch (authErr: any) {
      const rawErrMsg = authErr.message || String(authErr)
      const isInvalidGrant = rawErrMsg.includes('invalid_grant')
      return new Response(
        JSON.stringify({
          error: isInvalidGrant
            ? 'Falha de autenticação com o Google (invalid_grant): A chave privada ou o client_email são inválidos ou expiraram.'
            : `Falha na autenticação OAuth com o Google: ${rawErrMsg}`,
          details: rawErrMsg,
          email: creds.email,
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const rootFolderId = payload.folderId || '0B_Wkefn8LCZxUzdna1BjX0xoeU0'
    const resourceKey = payload.resourceKey || '0-liYQFyvNcEqpmKVrUq6cAw'

    const driveHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'X-Goog-Drive-Resource-Keys': `${rootFolderId}/${resourceKey}`,
    }

    // =========================================================================
    // STEP 1: SCAN & UPSERT METADATA (Fast: ~10-15s for 626 files across folders)
    // =========================================================================
    if (step === 'scan') {
      let rootFolderName = 'Blog LowCArb'
      try {
        const rootMetaRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${rootFolderId}?fields=id,name&supportsAllDrives=true`,
          { headers: driveHeaders },
        )
        if (rootMetaRes.ok) {
          const rootMeta = await rootMetaRes.json()
          if (rootMeta.name) rootFolderName = rootMeta.name
        } else {
          const errStatus = rootMetaRes.status
          const errText = await rootMetaRes.text()
          if (errStatus === 404 || errStatus === 403) {
            return new Response(
              JSON.stringify({
                error: `Compartilhe a pasta 'Blog LowCArb' com o e-mail ${creds.email} como Visualizador no Google Drive. O Google retornou erro ${errStatus}.`,
                details: errText,
                client_email: creds.email,
                folder_id: rootFolderId,
              }),
              {
                status: errStatus,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              },
            )
          }
        }
      } catch (rootErr: any) {
        console.warn('Falha de rede ao consultar pasta raiz:', rootErr)
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
            const errStatus = res.status
            const errText = await res.text()
            console.warn(
              `Erro ao listar pasta ${current.path} (${current.id}): ${errStatus} ${errText}`,
            )

            if (current.id === rootFolderId && (errStatus === 404 || errStatus === 403)) {
              return new Response(
                JSON.stringify({
                  error: `Compartilhe a pasta 'Blog LowCArb' com o e-mail ${creds.email} como Visualizador no Google Drive. Erro ${errStatus}.`,
                  details: errText,
                  client_email: creds.email,
                  folder_id: rootFolderId,
                }),
                {
                  status: errStatus,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                },
              )
            }
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

      // Existing records to preserve existing texto_extraido
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

      // Upsert in batches of 100 metadata rows
      let createdCount = 0
      let updatedCount = 0
      const batchSize = 100

      for (let i = 0; i < allFilesFound.length; i += batchSize) {
        const batch = allFilesFound.slice(i, i + batchSize)
        const rowsToUpsert = batch.map((f) => {
          const isExisting = existingMap.has(f.file_id)
          if (isExisting) updatedCount++
          else createdCount++

          const existingText = existingMap.get(f.file_id) || null
          return {
            file_id: f.file_id,
            nome: f.nome,
            mime_type: f.mime_type,
            tamanho_bytes: f.tamanho_bytes,
            modified_time: f.modified_time,
            link_drive: f.link_drive,
            caminho_pasta: f.caminho_pasta,
            texto_extraido: existingText,
            updated_at: new Date().toISOString(),
          }
        })

        const { error: upsertErr } = await supabase
          .from('drive_arquivos')
          .upsert(rowsToUpsert, { onConflict: 'file_id' })

        if (upsertErr) {
          throw new Error(`Erro no upsert de metadados: ${upsertErr.message}`)
        }
      }

      // Check total count and how many candidates still need extraction
      const { count: totalDbCount } = await supabase
        .from('drive_arquivos')
        .select('id', { count: 'exact', head: true })

      // Count files that lack text and match extractable formats
      // Text candidate mime types: docx, xlsx, rtf, txt, csv
      const { count: pendingExtractionCount } = await supabase
        .from('drive_arquivos')
        .select('id', { count: 'exact', head: true })
        .is('texto_extraido', null)
        .or(
          'mime_type.ilike.%wordprocessingml%,mime_type.ilike.%spreadsheetml%,mime_type.ilike.%rtf%,mime_type.eq.text/plain,mime_type.eq.text/csv,nome.ilike.%.docx,nome.ilike.%.xlsx,nome.ilike.%.rtf,nome.ilike.%.txt,nome.ilike.%.csv',
        )

      const totalFiles = totalDbCount || allFilesFound.length
      const pendingCount = pendingExtractionCount || 0
      const alreadyExtracted = totalFiles - pendingCount

      const updatedStats = {
        ...accumulatedStats,
        totalFound: totalFiles,
        foldersScanned: scannedFolders.length,
        skippedTemp: skippedTempFilesCount,
        created: createdCount,
        updated: updatedCount,
        alreadyWithText: alreadyExtracted,
      }

      if (pendingCount === 0) {
        // All files indexed already
        return new Response(
          JSON.stringify({
            status: 'completed',
            processados: totalFiles,
            restantes: 0,
            total: totalFiles,
            percentual: 100,
            mensagem: `Varredura concluída! Todos os ${totalFiles} arquivos estão indexados no banco.`,
            stats: updatedStats,
            summary: {
              totalFilesFound: totalFiles,
              skippedTempFiles: skippedTempFilesCount,
              newlyExtractedCount: 0,
              foldersScanned: scannedFolders.length,
              created: createdCount,
              updated: updatedCount,
            },
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      // Pass directly to incremental extraction step
      return new Response(
        JSON.stringify({
          status: 'in_progress',
          step: 'extract',
          offset: 0,
          processados: alreadyExtracted,
          restantes: pendingCount,
          total: totalFiles,
          percentual: Math.round((alreadyExtracted / (totalFiles || 1)) * 100),
          mensagem: `Metadados sincronizados (${totalFiles} arquivos). Extraindo textos pendentes (${pendingCount} restantes)...`,
          stats: updatedStats,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // =========================================================================
    // STEP 2: INCREMENTAL EXTRACTION (Processes up to MAX_EXTRACTIONS_PER_BATCH or TIME_BUDGET_MS)
    // =========================================================================
    if (step === 'extract') {
      // Fetch batch of files without text that match candidate extensions
      const { data: candidates, error: candidateErr } = await supabase
        .from('drive_arquivos')
        .select('id, file_id, nome, mime_type, tamanho_bytes')
        .is('texto_extraido', null)
        .or(
          'mime_type.ilike.%wordprocessingml%,mime_type.ilike.%spreadsheetml%,mime_type.ilike.%rtf%,mime_type.eq.text/plain,mime_type.eq.text/csv,nome.ilike.%.docx,nome.ilike.%.xlsx,nome.ilike.%.rtf,nome.ilike.%.txt,nome.ilike.%.csv',
        )
        .order('id', { ascending: true })
        .limit(MAX_EXTRACTIONS_PER_BATCH)

      if (candidateErr) {
        throw new Error(`Erro ao buscar candidatos para extração: ${candidateErr.message}`)
      }

      const itemsToProcess = candidates || []
      let batchExtractedCount = 0

      for (const file of itemsToProcess) {
        // Check time budget to never hit 150s idle timeout
        const elapsed = Date.now() - startTime
        if (elapsed > TIME_BUDGET_MS) {
          console.log(
            `Tempo limite da invocação atingido (${elapsed}ms). Salvando e pausando para próximo lote.`,
          )
          break
        }

        const mime = (file.mime_type || '').toLowerCase()
        const nome = (file.nome || '').toLowerCase()
        const tamanho = file.tamanho_bytes || 0

        const isDocx = mime.includes('wordprocessingml') || nome.endsWith('.docx')
        const isXlsx = mime.includes('spreadsheetml') || nome.endsWith('.xlsx')
        const isRtf = mime.includes('rtf') || nome.endsWith('.rtf')
        const isTxt = mime === 'text/plain' || nome.endsWith('.txt')
        const isCsv = mime === 'text/csv' || nome.endsWith('.csv')

        let extractedText: string | null = null

        // Extraction limit 8MB
        if ((isDocx || isXlsx || isRtf || isTxt || isCsv) && tamanho < 8 * 1024 * 1024) {
          try {
            const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.file_id}?alt=media&supportsAllDrives=true`
            const dlRes = await fetch(downloadUrl, { headers: driveHeaders })

            if (dlRes.ok) {
              if (isDocx) {
                const arrayBuf = await dlRes.arrayBuffer()
                extractedText = extractTextFromDocxZip(new Uint8Array(arrayBuf))
              } else if (isXlsx) {
                const arrayBuf = await dlRes.arrayBuffer()
                extractedText = extractTextFromXlsxZip(new Uint8Array(arrayBuf))
              } else if (isRtf) {
                const rtfRaw = await dlRes.text()
                extractedText = extractTextFromRtf(rtfRaw)
              } else if (isTxt || isCsv) {
                extractedText = await dlRes.text()
              }
            } else {
              console.warn(
                `Falha ao baixar arquivo ${file.nome} (${file.file_id}): HTTP ${dlRes.status}`,
              )
              // Mark as empty text with placeholder so it doesn't loop infinitely
              extractedText = `[Conteúdo indisponível no Google Drive - HTTP ${dlRes.status}]`
            }
          } catch (extractErr: any) {
            console.warn(`Erro na extração de ${file.nome}:`, extractErr)
            extractedText = `[Erro na extração: ${extractErr.message || 'desconhecido'}]`
          }
        } else if (tamanho >= 8 * 1024 * 1024) {
          extractedText = `[Arquivo maior que 8MB - extração de texto ignorada para performance]`
        } else {
          extractedText = `[Formato não suportado para extração direta de texto]`
        }

        // Save extracted text for this file
        const textToSave =
          extractedText && extractedText.trim().length > 0
            ? extractedText
            : '[Arquivo sem texto extraível]'

        const { error: updateErr } = await supabase
          .from('drive_arquivos')
          .update({
            texto_extraido: textToSave,
            updated_at: new Date().toISOString(),
          })
          .eq('id', file.id)

        if (!updateErr) {
          batchExtractedCount++
        }
      }

      // Check remaining pending extractions
      const { count: pendingExtractionCount } = await supabase
        .from('drive_arquivos')
        .select('id', { count: 'exact', head: true })
        .is('texto_extraido', null)
        .or(
          'mime_type.ilike.%wordprocessingml%,mime_type.ilike.%spreadsheetml%,mime_type.ilike.%rtf%,mime_type.eq.text/plain,mime_type.eq.text/csv,nome.ilike.%.docx,nome.ilike.%.xlsx,nome.ilike.%.rtf,nome.ilike.%.txt,nome.ilike.%.csv',
        )

      const { count: totalDbCount } = await supabase
        .from('drive_arquivos')
        .select('id', { count: 'exact', head: true })

      const totalFiles = totalDbCount || accumulatedStats.totalFound || 626
      const pendingRemaining = pendingExtractionCount || 0
      const totalProcessedSoFar = totalFiles - pendingRemaining

      const updatedStats = {
        ...accumulatedStats,
        totalFound: totalFiles,
        newlyExtracted: (accumulatedStats.newlyExtracted || 0) + batchExtractedCount,
      }

      const percent = Math.min(100, Math.round((totalProcessedSoFar / (totalFiles || 1)) * 100))

      if (pendingRemaining === 0 || itemsToProcess.length === 0) {
        return new Response(
          JSON.stringify({
            status: 'completed',
            processados: totalFiles,
            restantes: 0,
            total: totalFiles,
            percentual: 100,
            mensagem: `Sincronização concluída com sucesso! ${totalFiles} arquivos catalogados (${updatedStats.newlyExtracted} textos novos extraídos).`,
            stats: updatedStats,
            summary: {
              totalFilesFound: totalFiles,
              skippedTempFiles: updatedStats.skippedTemp || 0,
              newlyExtractedCount: updatedStats.newlyExtracted || 0,
              foldersScanned: updatedStats.foldersScanned || 0,
              created: updatedStats.created || 0,
              updated: updatedStats.updated || 0,
            },
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      // Still has files to extract — return in_progress
      return new Response(
        JSON.stringify({
          status: 'in_progress',
          step: 'extract',
          offset: batchOffset + itemsToProcess.length,
          processados: totalProcessedSoFar,
          restantes: pendingRemaining,
          total: totalFiles,
          percentual: percent,
          mensagem: `Processados ${totalProcessedSoFar} de ${totalFiles} (${pendingRemaining} textos pendentes)...`,
          stats: updatedStats,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({
        error: `Ação desconhecida: ${action} / etapa: ${step}`,
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    console.error('Erro em sync-drive:', err)
    return new Response(JSON.stringify({ error: err.message || String(err), stack: err.stack }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
