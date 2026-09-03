export interface CookieConsent {
  necessary: boolean // always true
  analytics: boolean
  marketing: boolean
  decidedAt: string
}

const COOKIE_CONSENT_KEY = 'guialowcarb_cookie_consent'

export const getConsent = (): CookieConsent | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

export const setConsent = (consent: { analytics: boolean; marketing: boolean }) => {
  if (typeof window === 'undefined') return
  const fullConsent: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    decidedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent))

  // Dispatch custom event so listeners (TrackingInitializer, Banner, etc) can react immediately
  window.dispatchEvent(
    new CustomEvent('cookie_consent_updated', {
      detail: fullConsent,
    }),
  )
}

export const hasAnalyticsConsent = (): boolean => {
  const consent = getConsent()
  return consent ? Boolean(consent.analytics) : false
}

export const hasMarketingConsent = (): boolean => {
  const consent = getConsent()
  return consent ? Boolean(consent.marketing) : false
}

export const openConsentPreferences = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('cookie_consent_open_preferences'))
}
