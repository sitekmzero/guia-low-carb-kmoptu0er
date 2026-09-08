import { supabase } from '@/lib/supabase/client'

export interface SeoConfig {
  meta_title: string
  meta_description: string
  slug: string
  focus_keyword: string
  secondary_keywords?: string[]
}

export interface PautaItem {
  id: string
  titulo: string
  variacoes_titulo?: string[]
  palavra_chave_principal: string
  palavras_chave_secundarias?: string[]
  intencao_busca?: string
  entidades?: string[]
  plano_links?: string
}

export interface CopywriterChecklist {
  seo: string
  geo: string
  clareza: string
  compliance: string
  cta: string
}

export interface CopywriterSession {
  id: string
  titulo: string
  publico: 'B2C' | 'B2B' | 'a_definir' | null
  tema: string | null
  objetivo: string | null
  restricoes: string | null
  referencias_arquivos: Array<{ id: string; nome: string; texto?: string }>
  pautas_propostas: PautaItem[]
  pauta_selecionada: PautaItem | null
  seo_config: SeoConfig
  checklist: Partial<CopywriterChecklist>
  artigo_gerado: string | null
  created_at: string
  updated_at: string
}

export interface CopywriterMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

/**
 * Cria nova sessão de copywriting
 */
export async function createCopywriterSession(
  titulo = 'Nova Conversa',
): Promise<CopywriterSession> {
  const { data, error } = await (supabase as any)
    .from('copywriter_sessions')
    .insert({
      titulo,
      publico: 'a_definir',
      referencias_arquivos: [],
      pautas_propostas: [],
      pauta_selecionada: {},
      seo_config: {
        meta_title: '',
        meta_description: '',
        slug: '',
        focus_keyword: '',
        secondary_keywords: [],
      },
      checklist: {},
      artigo_gerado: '',
    })
    .select('*')
    .single()

  if (error) throw error
  return data as CopywriterSession
}

/**
 * Busca todas as sessões ordenadas pela mais recente
 */
export async function listCopywriterSessions(): Promise<CopywriterSession[]> {
  const { data, error } = await (supabase as any)
    .from('copywriter_sessions')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data || []) as CopywriterSession[]
}

/**
 * Atualiza campos da sessão
 */
export async function updateCopywriterSession(
  id: string,
  updates: Partial<CopywriterSession>,
): Promise<CopywriterSession> {
  const { data, error } = await (supabase as any)
    .from('copywriter_sessions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as CopywriterSession
}

/**
 * Exclui uma sessão
 */
export async function deleteCopywriterSession(id: string): Promise<void> {
  const { error } = await (supabase as any).from('copywriter_sessions').delete().eq('id', id)

  if (error) throw error
}

/**
 * Busca mensagens de uma sessão
 */
export async function listSessionMessages(sessionId: string): Promise<CopywriterMessage[]> {
  const { data, error } = await (supabase as any)
    .from('copywriter_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []) as CopywriterMessage[]
}

/**
 * Adiciona mensagem à sessão
 */
export async function addSessionMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
): Promise<CopywriterMessage> {
  const { data, error } = await (supabase as any)
    .from('copywriter_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
    })
    .select('*')
    .single()

  if (error) throw error

  // Atualizar data da sessão
  await (supabase as any)
    .from('copywriter_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  return data as CopywriterMessage
}

/**
 * Envia mensagem para o edge function gemini-assist com ação copywriter_chat
 */
export async function sendCopywriterChatMessage(payload: {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  userInstruction?: string
  referenceTexts?: Array<{ nome: string; texto: string }>
}): Promise<{ text: string; modelUsed?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-assist', {
      body: {
        action: 'copywriter_chat',
        messages: payload.messages,
        userInstruction: payload.userInstruction,
        referenceTexts: payload.referenceTexts,
      },
    })

    if (error) {
      return { text: '', error: error.message || 'Erro ao chamar assistente' }
    }

    if (data?.error) {
      return { text: '', error: data.error }
    }

    return { text: data.text || '', modelUsed: data.modelUsed }
  } catch (err: any) {
    return { text: '', error: err?.message || 'Falha na conexão com a IA' }
  }
}

/**
 * Extrai dados estruturados de SEO e Pautas a partir do texto
 */
export async function extractPautasAndSeo(content: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-assist', {
      body: {
        action: 'extract_pautas_seo',
        content,
      },
    })

    if (error || !data?.success) {
      return null
    }

    return data.data || null
  } catch (err) {
    console.warn('Erro ao extrair pautas estruturadas:', err)
    return null
  }
}
