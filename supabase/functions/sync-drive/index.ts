import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Helper: base64url encoding
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function stringToBase64Url(str: string): string {
  return base64UrlEncode(new TextEncoder().encode(str))
}

// Convert PEM PKCS#8 RSA private key to CryptoKey
function pemToBinary(pem: string): ArrayBuffer {
  const cleanPem = pem
    .replace(/-----BEGIN[ A-Z0-9_-]+-----/g, '')
    .replace(/-----END[ A-Z0-9_-]+-----/g, '')
    .replace(/\s+/g, '')
  const raw = atob(cleanPem)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i)
  }
  return bytes.buffer
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const binaryKey = pemToBinary(pem)
  return await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )
}

// Create and sign JWT for Google OAuth2
async function getGoogleAccessToken(
  clientEmail: string,
  privateKeyPem: string,
  scopes: string[],
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }
  const claimSet = {
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = stringToBase64Url(JSON.stringify(header))
  const encodedClaimSet = stringToBase64Url(JSON.stringify(claimSet))
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`

  const privateKey = await importPrivateKey(privateKeyPem)
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken),
  )

  const encodedSignature = base64UrlEncode(new Uint8Array(signature))
  const jwt = `${unsignedToken}.${encodedSignature}`

  console.log(`Solicitando token Google OAuth2 para ${clientEmail}...`)
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  console.log(`Resposta Google OAuth2: ${tokenRes.status}`)

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text()
    throw new Error(`Falha na autenticação Google OAuth2: ${tokenRes.status} - ${errorBody}`)
  }

  const tokenData = await tokenRes.json()
  return tokenData.access_token
}

interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime?: string
  webViewLink?: string
  webContentLink?: string
  parents?: string[]
  trashed?: boolean
  resourceKey?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')
    if (!rawKey) {
      return new Response(
        JSON.stringify({
          error: 'Segredo GOOGLE_SERVICE_ACCOUNT_KEY não configurado no backend.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let parsedKey: any = null
    let clientEmail: string | null = null
    let privateKey: string | null = null

    // Check if rawKey is direct PEM (e.g. user pasted only the private key PEM string)
    if (typeof rawKey === 'string' && rawKey.includes('-----BEGIN PRIVATE KEY-----')) {
      let cleanedPem = rawKey.trim()
      // If it has surrounding quotes, strip or unescape them
      if (cleanedPem.startsWith('"') && cleanedPem.endsWith('"')) {
        try {
          cleanedPem = JSON.parse(cleanedPem)
        } catch {
          cleanedPem = cleanedPem.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '')
        }
      }
      privateKey = cleanedPem.replace(/\\n/g, '\n')
      // Fallback service account email provided in task specification
      clientEmail = 'sync-drive-supabase@project-be50844e-44c0-46da-a5e.iam.gserviceaccount.com'
    } else {
      try {
        parsedKey = JSON.parse(rawKey)
        if (typeof parsedKey === 'string') {
          try {
            parsedKey = JSON.parse(parsedKey)
          } catch {
            if (parsedKey.includes('-----BEGIN PRIVATE KEY-----')) {
              privateKey = parsedKey.replace(/\\n/g, '\n')
              clientEmail =
                'sync-drive-supabase@project-be50844e-44c0-46da-a5e.iam.gserviceaccount.com'
            }
          }
        }
      } catch (e) {
        // Maybe base64 encoded?
        try {
          const decoded = atob(rawKey)
          parsedKey = JSON.parse(decoded)
        } catch {
          return new Response(
            JSON.stringify({
              error: 'GOOGLE_SERVICE_ACCOUNT_KEY não pôde ser interpretado.',
              details: String(e),
              receivedType: typeof rawKey,
              sample: rawKey.slice(0, 50),
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      }

      if (parsedKey && typeof parsedKey === 'object') {
        clientEmail =
          parsedKey.client_email ||
          parsedKey.clientEmail ||
          parsedKey.email ||
          'sync-drive-supabase@project-be50844e-44c0-46da-a5e.iam.gserviceaccount.com'

        privateKey = parsedKey.private_key || parsedKey.privateKey || null
      }
    }

    if (!clientEmail || !privateKey) {
      const keysFound =
        typeof parsedKey === 'object' && parsedKey !== null ? Object.keys(parsedKey) : []
      return new Response(
        JSON.stringify({
          error: 'GOOGLE_SERVICE_ACCOUNT_KEY inválido: falta client_email ou private_key.',
          keysFound,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Parse request payload or defaults
    let folderId = '0B_Wkefn8LCZxUzdna1BjX0xoeU0'
    let resourceKey = '0-liYQFyvNcEqpmKVrUq6cAw'

    if (req.body) {
      try {
        const body = await req.json()
        if (body.folderId) folderId = body.folderId
        if (body.resourceKey !== undefined) resourceKey = body.resourceKey
      } catch {
        // empty body, use defaults
      }
    }

    // 1. Get access token
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey, [
      'https://www.googleapis.com/auth/drive.readonly',
    ])

    // Helper to call Google Drive API
    const driveHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    }
    if (resourceKey) {
      driveHeaders['X-Goog-Drive-Resource-Keys'] = `${folderId}/${resourceKey}`
    }

    // Optional request parameters: maxDepth or maxFiles
    let maxFilesLimit = 150
    let recursive = true
    if (req.body) {
      try {
        const body = await req.json()
        if (typeof body.maxFiles === 'number') maxFilesLimit = body.maxFiles
        if (typeof body.recursive === 'boolean') recursive = body.recursive
      } catch {
        // ignore
      }
    }

    const urlParams = new URL(req.url).searchParams
    if (urlParams.get('maxFiles')) {
      maxFilesLimit = parseInt(urlParams.get('maxFiles')!, 10)
    }

    // Verify folder accessibility
    const folderCheckUrl = new URL(`https://www.googleapis.com/drive/v3/files/${folderId}`)
    folderCheckUrl.searchParams.set('fields', 'id,name,mimeType,resourceKey')
    folderCheckUrl.searchParams.set('supportsAllDrives', 'true')

    const folderCheckRes = await fetch(folderCheckUrl.toString(), {
      headers: driveHeaders,
    })

    if (!folderCheckRes.ok) {
      const folderErr = await folderCheckRes.text()
      return new Response(
        JSON.stringify({
          success: false,
          error: `Não foi possível acessar a pasta do Google Drive (ID: ${folderId}). Código HTTP ${folderCheckRes.status}.`,
          status: folderCheckRes.status,
          details: folderErr,
          guidance:
            folderCheckRes.status === 404
              ? `O Google Drive retornou 404 (Pasta não encontrada). Como a pasta usa formato legado (${folderId}), verifique se ela foi compartilhada explicitamente com o e-mail da conta de serviço (${clientEmail}) como Leitor, ou tente abrir a pasta no Google Drive logado, copiar o ID novo da barra de endereços e compartilhar novamente.`
              : `Erro ao acessar pasta: ${folderErr}. Verifique permissões da conta de serviço ${clientEmail}.`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const folderData = await folderCheckRes.json()
    const folderName = folderData.name || 'Pasta raiz'

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Recursively list files in folders with safety limit
    const foldersToProcess = [folderId]
    const processedFolderIds = new Set<string>()
    const allFiles: GoogleDriveFile[] = []

    while (foldersToProcess.length > 0 && allFiles.length < maxFilesLimit) {
      const currentFolder = foldersToProcess.shift()!
      if (processedFolderIds.has(currentFolder)) continue
      processedFolderIds.add(currentFolder)

      let pageToken: string | undefined = undefined
      do {
        const listUrl = new URL('https://www.googleapis.com/drive/v3/files')
        listUrl.searchParams.set('q', `'${currentFolder}' in parents and trashed = false`)
        listUrl.searchParams.set(
          'fields',
          'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents,resourceKey)',
        )
        listUrl.searchParams.set('supportsAllDrives', 'true')
        listUrl.searchParams.set('includeItemsFromAllDrives', 'true')
        listUrl.searchParams.set('pageSize', '100')
        if (pageToken) listUrl.searchParams.set('pageToken', pageToken)

        const listRes = await fetch(listUrl.toString(), {
          headers: driveHeaders,
        })

        if (!listRes.ok) {
          const listErr = await listRes.text()
          console.error(`Erro ao listar itens da pasta ${currentFolder}:`, listErr)
          break
        }

        const data = await listRes.json()
        const items: GoogleDriveFile[] = data.files || []

        for (const item of items) {
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            if (recursive) {
              foldersToProcess.push(item.id)
            }
          } else {
            allFiles.push(item)
            if (allFiles.length >= maxFilesLimit) break
          }
        }

        pageToken = data.nextPageToken
      } while (pageToken && allFiles.length < maxFilesLimit)
    }

    // 3. Process extracted text and upsert to database in batches
    let createdCount = 0
    let updatedCount = 0
    const errors: Array<{ fileId: string; name: string; error: string }> = []

    // Fetch existing files from drive_arquivos to detect created vs updated
    const { data: existingRows } = await supabase.from('drive_arquivos').select('file_id')

    const existingFileIds = new Set((existingRows || []).map((r) => r.file_id))

    // Process files with text extraction (only for text/docs/sheets to keep within Edge timeout)
    const upsertRows: any[] = []

    for (const file of allFiles) {
      let extractedText: string | null = null

      try {
        // Text extraction rules:
        // Google Docs: export text/plain
        if (file.mimeType === 'application/vnd.google-apps.document') {
          const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text%2Fplain`
          const exportRes = await fetch(exportUrl, { headers: driveHeaders })
          if (exportRes.ok) {
            extractedText = await exportRes.text()
          }
        }
        // Google Sheets: export text/csv
        else if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
          const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text%2Fcsv`
          const exportRes = await fetch(exportUrl, { headers: driveHeaders })
          if (exportRes.ok) {
            extractedText = await exportRes.text()
          }
        }
        // Plain text files (.txt, .md, .csv)
        else if (
          file.mimeType === 'text/plain' ||
          file.mimeType === 'text/markdown' ||
          file.mimeType === 'text/csv'
        ) {
          // Download only if size is under 500KB to stay fast
          const fileSizeNum = file.size ? parseInt(file.size, 10) : 0
          if (fileSizeNum < 500000) {
            const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`
            const downRes = await fetch(downloadUrl, { headers: driveHeaders })
            if (downRes.ok) {
              extractedText = await downRes.text()
            }
          }
        }
        // PDF or others: metadata preview
        else if (file.mimeType === 'application/pdf') {
          extractedText = `[Documento PDF: ${file.name}] (Tamanho: ${file.size || 'desconhecido'} bytes)`
        } else if (file.mimeType.startsWith('image/')) {
          extractedText = `[Arquivo de Imagem: ${file.name}] (${file.mimeType})`
        }
      } catch (extractErr) {
        console.warn(`Erro ao extrair conteúdo do arquivo ${file.id} (${file.name}):`, extractErr)
      }

      const driveLink =
        file.webViewLink || file.webContentLink || `https://drive.google.com/file/d/${file.id}/view`

      upsertRows.push({
        file_id: file.id,
        nome: file.name,
        mime_type: file.mimeType,
        texto_extraido: extractedText,
        tamanho_bytes: file.size ? parseInt(file.size, 10) : 0,
        modified_time: file.modifiedTime || new Date().toISOString(),
        link_drive: driveLink,
        updated_at: new Date().toISOString(),
      })
    }

    // Upsert in batches of 25 rows
    const batchSize = 25
    for (let i = 0; i < upsertRows.length; i += batchSize) {
      const batch = upsertRows.slice(i, i + batchSize)
      const { error: upsertErr } = await supabase
        .from('drive_arquivos')
        .upsert(batch, { onConflict: 'file_id' })

      if (upsertErr) {
        console.error('Erro no upsert em lote:', upsertErr)
        errors.push({ fileId: 'batch', name: `Lote ${i}`, error: upsertErr.message })
      } else {
        for (const item of batch) {
          if (existingFileIds.has(item.file_id)) {
            updatedCount++
          } else {
            createdCount++
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        folder: {
          id: folderId,
          name: folderName,
        },
        summary: {
          totalFilesFound: allFiles.length,
          foldersScanned: processedFolderIds.size,
          created: createdCount,
          updated: updatedCount,
          errorCount: errors.length,
        },
        errors,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    console.error('Erro na sincronização do Google Drive:', err)
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
