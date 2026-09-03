import { hasAnalyticsConsent, hasMarketingConsent } from './consentService'

export const trackEvent = (eventName: string, eventData: any = {}) => {
  try {
    if (
      typeof window !== 'undefined' &&
      (window as any).dataLayer &&
      (hasAnalyticsConsent() || hasMarketingConsent())
    ) {
      ;(window as any).dataLayer.push({
        event: eventName,
        ...eventData,
      })
    }
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event]: ${eventName}`, eventData)
    }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

export const trackGoogleAdsConversion = (
  value: number,
  conversionId: string = 'AW-XXXXXXXXXX',
  label: string = 'YYYYYYYYYYYYYY',
) => {
  if (!hasMarketingConsent()) return
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'conversion', {
      send_to: `${conversionId}/${label}`,
      value,
      currency: 'BRL',
    })
  }
}

export const trackMetaPixelConversion = (
  eventName: string,
  value: number,
  contentName: string = '',
) => {
  if (!hasMarketingConsent()) return
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', eventName, {
        value,
        currency: 'BRL',
        content_name: contentName,
      })
    }
  } catch {
    // Silently fail
  }
}
