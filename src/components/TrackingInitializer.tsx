import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function TrackingInitializer() {
  const location = useLocation()

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Initialize Meta Pixel if not already present
        if (!window.fbq) {
          const script = document.createElement('script')
          script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '181692372415384');
            fbq('track', 'PageView');
          `
          document.head.appendChild(script)
        } else {
          window.fbq('track', 'PageView')
        }

        // Initialize GA4 & Google Ads if not already present
        if (!window.gtag) {
          const script1 = document.createElement('script')
          script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-70KXRPCMP7'
          script1.async = true
          document.head.appendChild(script1)

          const script2 = document.createElement('script')
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-70KXRPCMP7', { page_path: '${location.pathname}' });
            gtag('config', 'AW-18054612571', { page_path: '${location.pathname}' });
          `
          document.head.appendChild(script2)
        } else {
          window.gtag('config', 'G-70KXRPCMP7', { page_path: location.pathname })
          window.gtag('config', 'AW-18054612571', { page_path: location.pathname })
        }
      }
    } catch (error) {
      console.error('Tracking initialization error:', error)
    }
  }, [location])

  return null
}
