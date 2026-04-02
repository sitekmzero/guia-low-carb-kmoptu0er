import { ShieldAlert } from 'lucide-react'
import { SecurityApiKeys, SecurityDatabase, SecurityTwoFactor } from './components/SecurityCards'
import { SecurityUsers, SecurityAuditLog } from './components/SecurityTables'

export default function AdminSecurity() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          Segurança do Sistema
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie configurações de segurança, chaves de API e proteção de dados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityApiKeys />
        <div className="space-y-6">
          <SecurityDatabase />
          <SecurityTwoFactor />
        </div>
      </div>

      <SecurityUsers />
      <SecurityAuditLog />
    </div>
  )
}
