export const initABTest = (
  testName: string,
  variants: string[],
  userId: string = 'anon',
): string => {
  const key = `ab_test_${testName}`
  const stored = localStorage.getItem(key)
  if (stored && variants.includes(stored)) {
    return stored
  }
  const hash = `${userId}_${testName}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const selected = variants[hash % variants.length]
  localStorage.setItem(key, selected)
  return selected
}

export const trackABTestEvent = (
  testName: string,
  variant: string,
  eventName: string,
  eventData: any = {},
) => {
  import('@/services/analytics').then(({ trackEvent }) => {
    trackEvent('ab_test_event', {
      ab_test_name: testName,
      ab_test_variant: variant,
      event_name: eventName,
      ...eventData,
    })
  })
}
