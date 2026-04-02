import { ServerCog } from 'lucide-react'
import { SmtpBrevo, SmtpConfig, SmtpCdn } from './components/SmtpSettings'
import { SmtpTemplates, SmtpWebhooks } from './components/SmtpTables'
import { SmtpMetrics } from './components/SmtpCharts'

export default function AdminSMTP() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <ServerCog className="h-8 w-8 text-primary" />
          SMTP e CDN
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie configurações de e-mail, templates, webhooks e entrega de conteúdo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SmtpBrevo />
          <SmtpCdn />
        </div>
        <div className="lg:col-span-2">
          <SmtpConfig />
        </div>
      </div>

      <SmtpMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmtpTemplates />
        <SmtpWebhooks />
      </div>
    </div>
  )
}
