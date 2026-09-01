import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/services/analytics'

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        const dismissed = localStorage.getItem('exit_intent_dismissed')
        if (!dismissed) {
          setOpen(true)
          setHasTriggered(true)
          trackEvent('exit_intent_impression')
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasTriggered])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem('exit_intent_dismissed', 'true')
    trackEvent('exit_intent_dismiss')
  }

  const handleAccept = () => {
    trackEvent('exit_intent_click')
    setOpen(false)
    localStorage.setItem('exit_intent_dismissed', 'true')
    navigate('/ebook-gratuito')
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-center">Espera aí!</DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            Ganhe 20% de desconto na sua primeira consulta ou baixe nosso Guia Low-Carb totalmente
            grátis!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleAccept} variant="cta" className="h-12 text-lg font-bold">
            Aproveitar Oferta
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Não, obrigado.
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
