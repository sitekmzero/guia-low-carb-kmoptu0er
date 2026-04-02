import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '@/services/analytics'
import { storeUTMParams } from '@/services/utm'
import { trackWebVitals } from '@/services/performance'

export function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    storeUTMParams()
    trackWebVitals()
  }, [])

  useEffect(() => {
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
