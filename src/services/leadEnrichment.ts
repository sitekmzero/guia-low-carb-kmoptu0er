// Mock Lead Enrichment Service
export const enrichLeadData = async (leadEmail: string) => {
  // In a real scenario, you would call an external API (like Clearbit or Apollo) here
  // simulating a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    company: 'Empresa Exemplo SA',
    jobTitle: 'Gestor',
    location: 'São Paulo, SP',
    industry: 'Healthcare',
  }
}
