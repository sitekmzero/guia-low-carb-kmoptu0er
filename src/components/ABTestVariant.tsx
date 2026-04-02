import React, { useEffect, useState } from 'react'
import { initABTest, trackABTestEvent } from '@/services/abTesting'

interface ABTestVariantProps {
  testName: string
  variants: { [key: string]: React.ReactNode }
}

export function ABTestVariant({ testName, variants }: ABTestVariantProps) {
  const [activeVariant, setActiveVariant] = useState<string | null>(null)

  useEffect(() => {
    const keys = Object.keys(variants)
    if (keys.length === 0) return

    let userId = localStorage.getItem('anon_user_id')
    if (!userId) {
      userId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('anon_user_id', userId)
    }

    const selected = initABTest(testName, keys, userId)
    setActiveVariant(selected)

    trackABTestEvent(testName, selected, 'impression')
  }, [testName, variants])

  if (!activeVariant || !variants[activeVariant]) {
    return null
  }

  return <>{variants[activeVariant]}</>
}
