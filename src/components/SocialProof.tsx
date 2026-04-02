import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { trackEvent } from '@/services/analytics'

const testimonials = [
  {
    name: 'Maria S.',
    quote: 'A melhor decisão que tomei. Minha saúde transformou-se em semanas!',
    result: '-8kg em 2 meses',
  },
  {
    name: 'João P.',
    quote: 'Excelente acompanhamento, plano super realista e fácil de seguir.',
    result: 'Glicemia controlada',
  },
  {
    name: 'Ana T.',
    quote: 'O curso abriu minha mente para uma alimentação mais consciente e sem sofrimento.',
    result: 'Mais disposição diária',
  },
]

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="bg-card p-8 rounded-2xl border shadow-soft flex flex-col items-center text-center max-w-lg mx-auto"
      onMouseEnter={() =>
        trackEvent('testimonial_view', { author: testimonials[currentIndex].name })
      }
    >
      <div className="flex gap-1 text-yellow-500 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>
      <p className="text-lg font-medium italic text-foreground mb-6 min-h-[60px]">
        "{testimonials[currentIndex].quote}"
      </p>
      <div>
        <p className="font-bold text-primary text-lg">{testimonials[currentIndex].name}</p>
        <p className="text-sm font-semibold text-muted-foreground mt-1">
          {testimonials[currentIndex].result}
        </p>
      </div>
    </div>
  )
}
