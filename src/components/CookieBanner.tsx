import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cookie, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { getConsent, setConsent, CookieConsent } from '@/services/consentService'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)
  const [marketingAllowed, setMarketingAllowed] = useState(false)

  useEffect(() => {
    const existing = getConsent()
    if (!existing) {
      setShowBanner(true)
    } else {
      setAnalyticsAllowed(existing.analytics)
      setMarketingAllowed(existing.marketing)
    }

    const handleOpenPreferences = () => {
      const current = getConsent()
      if (current) {
        setAnalyticsAllowed(current.analytics)
        setMarketingAllowed(current.marketing)
      } else {
        setAnalyticsAllowed(false)
        setMarketingAllowed(false)
      }
      setShowModal(true)
    }

    const handleConsentUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsent>
      if (customEvent.detail) {
        setAnalyticsAllowed(customEvent.detail.analytics)
        setMarketingAllowed(customEvent.detail.marketing)
      }
    }

    window.addEventListener('cookie_consent_open_preferences', handleOpenPreferences)
    window.addEventListener('cookie_consent_updated', handleConsentUpdated)

    return () => {
      window.removeEventListener('cookie_consent_open_preferences', handleOpenPreferences)
      window.removeEventListener('cookie_consent_updated', handleConsentUpdated)
    }
  }, [])

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true })
    setAnalyticsAllowed(true)
    setMarketingAllowed(true)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleOnlyNecessary = () => {
    setConsent({ analytics: false, marketing: false })
    setAnalyticsAllowed(false)
    setMarketingAllowed(false)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleSaveCustom = () => {
    setConsent({ analytics: analyticsAllowed, marketing: marketingAllowed })
    setShowBanner(false)
    setShowModal(false)
  }

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Consentimento de cookies"
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl p-4 md:p-6 animate-fade-in"
        >
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Valorizamos sua privacidade e seus dados
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Utilizamos cookies e tecnologias similares para garantir o funcionamento seguro do
                  site, analisar o tráfego e personalizar conteúdos e anúncios conforme a LGPD.
                  Cookies de marketing e análise só são ativados com a sua autorização expressa.{' '}
                  <Link
                    to="/politica-de-privacidade"
                    className="text-primary underline font-medium hover:text-primary/80"
                  >
                    Saiba mais na nossa Política de Privacidade.
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="text-xs rounded-full h-9 px-3 border-muted-foreground/30"
                onClick={() => setShowModal(true)}
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Personalizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs rounded-full h-9 px-4 border-primary text-primary hover:bg-primary/10"
                onClick={handleOnlyNecessary}
              >
                Somente necessários
              </Button>
              <Button
                variant="cta"
                size="sm"
                className="text-xs rounded-full h-9 px-5 shadow-sm"
                onClick={handleAcceptAll}
              >
                Aceitar todos
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personalização */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary font-heading text-xl">
              <ShieldCheck className="w-6 h-6 text-primary" />
              Preferências de Privacidade e Cookies
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              Escolha quais categorias de cookies você autoriza. Os cookies estritamente necessários
              são indispensáveis para o funcionamento do site e da sua área de navegação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Necessários */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border">
              <div className="space-y-0.5 pr-4">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  Cookies Estritamente Necessários
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    Obrigatórios
                  </span>
                </span>
                <p className="text-xs text-muted-foreground">
                  Fundamentais para navegação, segurança, autenticação e gravação das suas
                  preferências de privacidade.
                </p>
              </div>
              <Switch checked={true} disabled aria-label="Cookies necessários (obrigatórios)" />
            </div>

            {/* Analíticos */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border">
              <div className="space-y-0.5 pr-4">
                <span className="text-sm font-semibold text-foreground">
                  Cookies de Estatística e Desempenho (Analytics)
                </span>
                <p className="text-xs text-muted-foreground">
                  Permitem compreender de forma agregada como os visitantes interagem com o site
                  (Google Analytics / GA4) para melhorias contínuas.
                </p>
              </div>
              <Switch
                checked={analyticsAllowed}
                onCheckedChange={setAnalyticsAllowed}
                aria-label="Cookies analíticos"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border">
              <div className="space-y-0.5 pr-4">
                <span className="text-sm font-semibold text-foreground">
                  Cookies de Marketing e Conversão
                </span>
                <p className="text-xs text-muted-foreground">
                  Utilizados por plataformas como Google Ads e Meta Pixel para mensurar a eficácia
                  de campanhas e evitar exibição de anúncios irrelevantes.
                </p>
              </div>
              <Switch
                checked={marketingAllowed}
                onCheckedChange={setMarketingAllowed}
                aria-label="Cookies de marketing"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs"
              onClick={handleOnlyNecessary}
            >
              Rejeitar opcionais
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs border-primary text-primary"
                onClick={handleAcceptAll}
              >
                Aceitar todos
              </Button>
              <Button
                type="button"
                variant="cta"
                size="sm"
                className="w-full sm:w-auto text-xs"
                onClick={handleSaveCustom}
              >
                Salvar preferências
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
