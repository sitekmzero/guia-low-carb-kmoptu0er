export const sendMetrics = (name: string, value: number, id: string) => {
  import('./analytics').then(({ trackEvent }) => {
    trackEvent('web_vitals', {
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id,
    })
  })
}

export const trackWebVitals = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          sendMetrics('LCP', entry.startTime, entry.name)
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          sendMetrics('FID', entry.duration, entry.name)
        }
      }).observe({ type: 'first-input', buffered: true })

      new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        sendMetrics('CLS', clsValue, 'cls-id')
      }).observe({ type: 'layout-shift', buffered: true })
    } catch (e) {
      console.warn('PerformanceObserver error', e)
    }
  }
}
