import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '@/services/analytics'
import { storeUTMParams } from '@/services/utm'
import { trackWebVitals } from '@/services/performance'
import { updateCanonicalLink } from '@/services/seo'

export function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    storeUTMParams()
    trackWebVitals()
  }, [])

  useEffect(() => {
    // Dynamic canonical link update on every route change
    updateCanonicalLink()

    const handler = setTimeout(() => {
      trackEvent('page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }, 1000)

    return () => clearTimeout(handler)
  }, [location.pathname, location.search])

  return null
}
