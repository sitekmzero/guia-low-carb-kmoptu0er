import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ProgressiveForm } from './ProgressiveForm'

interface LeadCapturePopupProps {
  trigger: 'exit-intent' | 'time-based' | 'scroll-depth' | 'page-specific'
  delay?: number
  content?: {
    headline: string
    subheadline: string
  }
}

export function LeadCapturePopup({ trigger, delay = 0, content }: LeadCapturePopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (hasTriggered) return

    let timer: any

    if (trigger === 'time-based') {
      timer = setTimeout(() => {
        setIsOpen(true)
        setHasTriggered(true)
      }, delay * 1000)
    } else if (trigger === 'scroll-depth') {
      const handleScroll = () => {
        const scrollPercent =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        if (scrollPercent > 50) {
          setIsOpen(true)
          setHasTriggered(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    } else if (trigger === 'exit-intent') {
      const handleMouseOut = (e: MouseEvent) => {
        if (e.clientY <= 10) {
          setIsOpen(true)
          setHasTriggered(true)
          document.removeEventListener('mouseleave', handleMouseOut)
        }
      }
      document.addEventListener('mouseleave', handleMouseOut)
      return () => document.removeEventListener('mouseleave', handleMouseOut)
    }

    return () => clearTimeout(timer)
  }, [trigger, delay, hasTriggered])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-background">
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading mb-2 text-white">
              {content?.headline || 'Não vá embora!'}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/90 text-base">
              {content?.subheadline || 'Você está a um passo de transformar sua saúde.'}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          <ProgressiveForm source={`popup-${trigger}`} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
