/**
 * Helper para envio de notificações formatadas ao Slack via Incoming Webhook.
 * Realiza fallback silencioso caso SLACK_WEBHOOK_URL não esteja configurada.
 */

export interface SlackMessagePayload {
  text: string
  blocks?: Array<Record<string, unknown>>
  attachments?: Array<Record<string, unknown>>
}

/**
 * Envia uma mensagem via webhook para o Slack.
 * Retorna true se enviou com sucesso, false caso a webhook não esteja configurada ou ocorra erro.
 */
export async function sendSlackNotification(
  payload: string | SlackMessagePayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')

    if (!webhookUrl) {
      console.log(
        '[SLACK] SLACK_WEBHOOK_URL não configurada. Notificação ignorada silenciosamente.',
      )
      return { success: false, error: 'SLACK_WEBHOOK_URL_NOT_SET' }
    }

    const body = typeof payload === 'string' ? { text: payload } : payload

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(
        `[SLACK] Falha ao enviar notificação ao Slack (${response.status}): ${errorText}`,
      )
      return { success: false, error: errorText }
    }

    console.log('[SLACK] Notificação enviada com sucesso para o Slack.')
    return { success: true }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('[SLACK] Exceção ao enviar notificação para o Slack:', errorMsg)
    return { success: false, error: errorMsg }
  }
}

/**
 * Alerta de Lead Quente (Lead Scoring alto >= 70)
 */
export async function sendHotLeadAlert(lead: {
  email: string
  name?: string
  score: number
  source?: string
  phone?: string
}) {
  const nameDisplay = lead.name || 'Lead sem nome'
  const text = `🔥 *Novo Lead Quente Detectado!* (Score: ${lead.score} pts)\n• *Nome:* ${nameDisplay}\n• *Email:* ${lead.email}\n• *Score:* ${lead.score}/100\n• *Origem:* ${lead.source || 'Não informada'}${lead.phone ? `\n• *Telefone:* ${lead.phone}` : ''}\n👉 Acesse o CRM do Guia Low Carb para entrar em contato rápido.`

  return await sendSlackNotification({
    text: `🔥 Lead Quente: ${lead.email} atingiu pontuação ${lead.score}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🔥 Alerta de Lead Quente - Guia Low Carb',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Lead:*\n${nameDisplay}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${lead.email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Pontuação (Score):*\n\`${lead.score} pts\` (Alta probabilidade)`,
          },
          {
            type: 'mrkdwn',
            text: `*Origem:*\n${lead.source || 'Website / CRM'}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ *Horário:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} | Ação recomendada: Contatar imediatamente`,
          },
        ],
      },
    ],
  })
}

/**
 * Alerta de Erro de Compra / Processamento
 */
export async function sendPurchaseErrorAlert(errorDetails: {
  user_email?: string
  product_id?: string
  amount?: number
  payment_method?: string
  transaction_id?: string
  error_message: string
}) {
  const text = `🚨 *Erro no Processamento de Compra!*\n• *Cliente:* ${errorDetails.user_email || 'N/A'}\n• *Produto:* ${errorDetails.product_id || 'N/A'}\n• *Valor:* ${errorDetails.amount ? `R$ ${errorDetails.amount}` : 'N/A'}\n• *Método:* ${errorDetails.payment_method || 'N/A'}\n• *Erro:* \`${errorDetails.error_message}\`\n⚠️ Verifique as transações no dashboard.`

  return await sendSlackNotification({
    text: `🚨 Falha na compra de ${errorDetails.user_email || 'cliente'}: ${errorDetails.error_message}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Erro em Processamento de Compra',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Falha ao processar pagamento ou liberar acesso:*\n\`${errorDetails.error_message}\``,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Cliente:*\n${errorDetails.user_email || 'Não identificado'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Produto ID:*\n${errorDetails.product_id || 'N/A'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Valor:*\n${errorDetails.amount ? `R$ ${errorDetails.amount}` : 'N/A'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Método:*\n${errorDetails.payment_method || 'N/A'}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ *Horário:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} | Status: Investigação requerida`,
          },
        ],
      },
    ],
  })
}

/**
 * Alerta de Erros de Monitoramento do Sistema / Segurança / Rastreamento
 */
export async function sendSystemErrorAlert(errorDetails: {
  system_component: string
  error_message: string
  count?: number
  context?: Record<string, unknown>
}) {
  const countStr =
    errorDetails.count !== undefined ? `\n• *Ocorrências:* ${errorDetails.count}` : ''
  const text = `⚠️ *Alerta de Erro no Sistema / Monitoramento*\n• *Componente:* ${errorDetails.system_component}\n• *Detalhes:* \`${errorDetails.error_message}\`${countStr}\n⚠️ Requer atenção no painel de administração.`

  return await sendSlackNotification({
    text: `⚠️ Erro de Monitoramento (${errorDetails.system_component}): ${errorDetails.error_message}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `⚠️ Alerta de Monitoramento: ${errorDetails.system_component}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Descrição do Erro:*\n\`${errorDetails.error_message}\``,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ *Horário:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} | Guia Low Carb Monitoramento`,
          },
        ],
      },
    ],
  })
}

/**
 * Alerta de Relatório Gerado
 */
export async function sendReportGeneratedAlert(reportDetails: {
  report_type: string
  report_name?: string
  total_leads?: number
  total_sales?: number
  revenue?: number
  recipients?: string[]
  details?: string
}) {
  const typeFormatted =
    reportDetails.report_name || reportDetails.report_type.replace(/_/g, ' ').toUpperCase()

  return await sendSlackNotification({
    text: `📊 Novo Relatório Gerado: ${typeFormatted}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 Relatório Gerado com Sucesso',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Tipo de Relatório:*\n${typeFormatted}`,
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n✅ Gerado e Disponibilizado`,
          },
          ...(reportDetails.total_leads !== undefined
            ? [
                {
                  type: 'mrkdwn',
                  text: `*Leads no Período:*\n${reportDetails.total_leads}`,
                },
              ]
            : []),
          ...(reportDetails.revenue !== undefined
            ? [
                {
                  type: 'mrkdwn',
                  text: `*Faturamento:*\nR$ ${reportDetails.revenue.toFixed(2)}`,
                },
              ]
            : []),
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ *Data/Hora:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} | Guia Low Carb BI & Relatórios`,
          },
        ],
      },
    ],
  })
}
