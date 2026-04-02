export const parseUTMParams = () => {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  }
}

export const storeUTMParams = () => {
  const utms = parseUTMParams()
  if (utms.utm_source) {
    localStorage.setItem('utm_params', JSON.stringify(utms))
  }
}

export const getUTMParams = () => {
  try {
    const stored = localStorage.getItem('utm_params')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}
