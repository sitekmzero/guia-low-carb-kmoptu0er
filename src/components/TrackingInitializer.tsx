import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getConsent, CookieConsent } from '@/services/consentService'

export function TrackingInitializer() {
  const location = useLocation()
  const [consent, setConsentState] = useState<CookieConsent | null>(() => getConsent())

  useEffect(() => {
    const handleConsentUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsent>
      setConsentState(customEvent.detail || getConsent())
    }

    window.addEventListener('cookie_consent_updated', handleConsentUpdated)
    return () => {
      window.removeEventListener('cookie_consent_updated', handleConsentUpdated)
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return

      let isPreview = false
      try {
        isPreview =
          window.self !== window.top ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.includes('preview') ||
          window.location.hostname.includes('goskip.dev') ||
          (typeof document !== 'undefined' && document.referrer.includes('goskip.dev'))
      } catch {
        isPreview = true
      }

      // Check consent
      const hasAnalytics = Boolean(consent?.analytics)
      const hasMarketing = Boolean(consent?.marketing)

      // Initialize GTM when analytics or marketing consent is granted
      if (
        (hasAnalytics || hasMarketing) &&
        !window.dataLayer?.some?.((item: any) => item['gtm.start'])
      ) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        const gtmScript = document.createElement('script')
        gtmScript.async = true
        gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-NHWQM369'
        document.head.appendChild(gtmScript)
      }

      // Initialize GA4 only with analytics consent
      if (hasAnalytics) {
        if (!document.getElementById('gtag-ga4-script')) {
          const script1 = document.createElement('script')
          script1.id = 'gtag-ga4-script'
          script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-70KXRPCMP7'
          script1.async = true
          document.head.appendChild(script1)

          window.dataLayer = window.dataLayer || []
          if (typeof window.gtag !== 'function') {
            window.gtag = function (...args: any[]) {
              window.dataLayer.push(args)
            }
          }
          window.gtag('js', new Date())
          window.gtag('config', 'G-70KXRPCMP7', { page_path: location.pathname })
        } else if (typeof window.gtag === 'function') {
          window.gtag('config', 'G-70KXRPCMP7', { page_path: location.pathname })
        }
      }

      // Initialize Google Ads only with marketing consent
      if (hasMarketing) {
        if (!document.getElementById('gtag-ads-script')) {
          const adsScript = document.createElement('script')
          adsScript.id = 'gtag-ads-script'
          adsScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18054612571'
          adsScript.async = true
          document.head.appendChild(adsScript)

          window.dataLayer = window.dataLayer || []
          if (typeof window.gtag !== 'function') {
            window.gtag = function (...args: any[]) {
              window.dataLayer.push(args)
            }
          }
          window.gtag('config', 'AW-18054612571', { page_path: location.pathname })
        } else if (typeof window.gtag === 'function') {
          window.gtag('config', 'AW-18054612571', { page_path: location.pathname })
        }
      }

      // Initialize Meta Pixel only with marketing consent and outside preview
      if (hasMarketing && !isPreview) {
        try {
          if (!window.fbq) {
            const script = document.createElement('script')
            script.innerHTML = `
              try {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                if (window.fbq) {
                  fbq('init', '181692372415384');
                  fbq('track', 'PageView');
                }
              } catch { /* intentionally ignored */ }
            `
            document.head.appendChild(script)
          } else {
            window.fbq('track', 'PageView')
          }
        } catch {
          // Silently fail Meta Pixel errors
        }
      }
    } catch (error) {
      console.error('Tracking initialization error:', error)
    }
  }, [location, consent])

  return null
}
