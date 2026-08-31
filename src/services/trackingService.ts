declare global {
  interface Window {
    fbq: any
    gtag: any
    dataLayer: any
  }
}

export const trackingService = {
  trackEvent: (eventName: string, eventData?: any): boolean => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, eventData)
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventData)
      }
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Tracking error:', error)
      }
      return false
    }
  },

  trackPurchase: (value: number, currency: string, product_id: string): boolean => {
    try {
      trackingService.trackEvent('Purchase')

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', { value, currency })
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', { value, currency, transaction_id: product_id })
      }

      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Track Purchase error:', error)
      }
      return false
    }
  },

  trackLead: (lead_source: string, product_interest: string): boolean => {
    try {
      trackingService.trackEvent('Lead')

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: product_interest,
          content_category: lead_source,
        })
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          value: 0,
          currency: 'BRL',
          lead_source,
        })
      }

      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Track Lead error:', error)
      }
      return false
    }
  },

  trackConsultationBooked: (consultation_type: string, value: number): boolean => {
    try {
      trackingService.trackEvent('ConsultationBooked')

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: consultation_type })
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { value, currency: 'BRL' })
        window.gtag('event', 'consultation_booked', { value, consultation_type })
      }

      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Track Consultation error:', error)
      }
      return false
    }
  },

  trackCourseEnrolled: (course_name: string, course_price: number): boolean => {
    try {
      trackingService.trackEvent('CourseEnrolled')

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          content_name: course_name,
          value: course_price,
          currency: 'BRL',
        })
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', { value: course_price, currency: 'BRL' })
        window.gtag('event', 'course_enrolled', { value: course_price, course_name })
      }

      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Track Course error:', error)
      }
      return false
    }
  },
}
