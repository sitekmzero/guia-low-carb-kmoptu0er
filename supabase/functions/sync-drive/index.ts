import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * Edge function sync-drive v2
 * Scans Google Drive shared folder recursively using GOOGLE_SERVICE_ACCOUNT_KEY
 * Upserts all files into drive_arquivos with folder path (caminho_pasta, e.g. "Blog LowCArb/Textos/").
 * Idempotent upsert matching on file_id, preserving extracted text.
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

  // Inspect possible keys for private_key (snake_case, camelCase or direct string)
  const pem =
    serviceAccountJson.private_key || serviceAccountJson.privateKey || serviceAccountJson.key
  if (!pem) {
    throw new Error(
      `Chave privada não encontrada no objeto serviceAccount. Chaves disponíveis: ${Object.keys(serviceAccountJson).join(', ')}`,
    )
  }
  const normalizedPem = pem.replace(/\\n/g, '\n')
  // Strip headers and all non-base64 characters
  const pemContents = normalizedPem
    .replace(/-----BEGIN[ A-Z0-9_-]+-----/gi, '')
    .replace(/-----END[ A-Z0-9_-]+-----/gi, '')
    .replace(/[^A-Za-z0-9+/=]/g, '')

  // Pad base64 if needed
  let padded = pemContents
  while (padded.length % 4 !== 0) {
    padded += '='
  }

  let binaryKey: string
  try {
    binaryKey = atob(padded)
  } catch (b64Err: any) {
    throw new Error(
      `Erro ao decodificar base64 do PEM (len: ${pemContents.length}, sample: ${pemContents.slice(0, 30)}...): ${b64Err.message}`,
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const googleKeyRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY') || ''

  if (!googleKeyRaw) {
    return new Response(
      JSON.stringify({ error: 'Secret GOOGLE_SERVICE_ACCOUNT_KEY não configurado no backend.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  let serviceAccount: any
  // Let's inspect googleKeyRaw structure safely
  let emailDetected = ''
  const emailMatch = googleKeyRaw.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.iam\.gserviceaccount\.com/,
  )
  if (emailMatch) {
    emailDetected = emailMatch[0]
  }

  // Find private key within googleKeyRaw
  let privKeyDetected = ''
  const pemMatch = googleKeyRaw.match(
    /-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA )?PRIVATE KEY-----/,
  )
  if (pemMatch) {
    privKeyDetected = pemMatch[0]
  } else {
    privKeyDetected = googleKeyRaw
  }

  // Return diagnostics about the secret structure to see why account not found
  if (req.headers.get('x-debug') === 'true') {
    return new Response(
      JSON.stringify({
        emailDetected,
        hasPem: !!pemMatch,
        rawLen: googleKeyRaw.length,
        sampleRaw: googleKeyRaw.slice(0, 30) + '...' + googleKeyRaw.slice(-30),
        startsWith: googleKeyRaw.slice(0, 50),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  serviceAccount = {
    client_email: emailDetected || 'adriana.araujo@kmzero.com.br',
    private_key: privKeyDetected,
    rawPreview: googleKeyRaw.slice(0, 100),
    hasEmail: !!emailDetected,
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    const payload = await req.json().catch(() => ({}))
    const rootFolderId = payload.folderId || '0B_Wkefn8LCZxUzdna1BjX0xoeU0'
    const resourceKey = payload.resourceKey || '0-liYQFyvNcEqpmKVrUq6cAw'

    const accessToken = await getGoogleAuthToken(serviceAccount)

    // Headers with ResourceKey for Google Drive older shared links
    const driveHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'X-Goog-Drive-Resource-Keys': `${rootFolderId}/${resourceKey}`,
    }

    // First fetch root folder metadata to get root name
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
      // fallback to 'Blog LowCArb'
    }

    // Traverse recursively
    interface FolderQueueItem {
      id: string
      path: string // e.g. "Blog LowCArb/"
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

    // Now upsert allFilesFound in batches of 100 into public.drive_arquivos
    // IMPORTANT: Do NOT overwrite texto_extraido if it already exists in the database!
    // Supabase upsert: onConflict: 'file_id'
    // To preserve texto_extraido, we only update caminho_pasta, nome, mime_type, tamanho_bytes, modified_time, link_drive, updated_at
    // Let's do batch updates
    let updatedCount = 0
    let createdCount = 0

    // Fetch existing file_ids to see which ones are updates vs inserts
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
          // If already existing, retain existing text if any; if not present, null
          texto_extraido: existingMap.get(f.file_id) ?? null,
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
          foldersScanned: scannedFolders.length,
          created: createdCount,
          updated: updatedCount,
          folderPathsSample: scannedFolders.slice(0, 10),
        },
        folder: {
          name: rootFolderName,
          id: rootFolderId,
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
