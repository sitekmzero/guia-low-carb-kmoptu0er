import { supabase } from '@/lib/supabase/client'

export interface SeoGenerationResponse {
  meta_title: string
  meta_description: string
  focus_keyword: string
  slug: string
  tags: string[]
  image_alt_suggestion?: string
  seo_tips?: string
}

export interface GeminiDraftResponse {
  success: boolean
  text: string
  json?: any
  modelUsed?: string
  error?: string
}

/**
 * Chamada à Edge Function gemini-assist
 */
export async function invokeGeminiAssist(payload: {
  action: 'draft' | 'improve' | 'seo' | 'suggest_tags' | 'free_prompt'
  title?: string
  content?: string
  selectedText?: string
  briefing?: string
  driveContent?: string
  driveFileName?: string
  userInstruction?: string
}): Promise<{ data: any; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-assist', {
      body: payload,
    })

    if (error) {
      return { data: null, error: error.message || 'Erro ao chamar assistente IA' }
    }

    if (data?.error) {
      return { data: null, error: data.error }
    }

    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || 'Falha de comunicação com o servidor' }
  }
}

export interface OpenAiImageResponse {
  success: boolean
  imageUrl: string
  altText: string
  model: string
  generationsToday: number
  dailyLimit: number
  remaining: number
  error?: string
}

/**
 * Chamada à Edge Function openai-image
 */
export async function invokeOpenAiImage(payload: {
  prompt: string
  userEmail?: string
  checkOnly?: boolean
}): Promise<{ data: OpenAiImageResponse | null; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-image', {
      body: payload,
    })

    if (error) {
      return { data: null, error: error.message || 'Erro ao processar imagem IA' }
    }

    if (data?.error) {
      return { data: null, error: data.error }
    }

    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || 'Falha na conexão com o serviço de imagem' }
  }
}

/**
 * Busca status diário de uso de imagens
 */
export async function fetchDailyImageUsage(): Promise<{
  generationsToday: number
  dailyLimit: number
  remaining: number
}> {
  try {
    const { data } = await supabase.functions.invoke('openai-image', {
      body: { checkOnly: true },
    })
    if (data) {
      return {
        generationsToday: data.generationsToday || 0,
        dailyLimit: data.dailyLimit || 20,
        remaining: data.remaining ?? 20,
      }
    }
  } catch (e) {
    console.warn('Erro ao checar limite diário de imagem:', e)
  }
  return { generationsToday: 0, dailyLimit: 20, remaining: 20 }
}
