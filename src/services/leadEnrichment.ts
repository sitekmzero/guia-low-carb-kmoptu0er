// Lead Enrichment Service
export const enrichLeadData = async (leadEmail: string) => {
  if (!leadEmail) return null

  // Extrai o domínio de e-mail corporativo se aplicável, sem inventar empresas fake
  const parts = leadEmail.split('@')
  const domain = parts[1] || ''
  const isGeneric = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'outlook.com',
    'icloud.com',
    'uol.com.br',
    'bol.com.br',
  ].includes(domain.toLowerCase())

  return {
    company: isGeneric ? '' : domain.split('.')[0].toUpperCase(),
    jobTitle: '',
    location: '',
    industry: 'Nutrição & Saúde',
  }
}
