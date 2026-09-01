import { useEffect } from 'react'

export const updateCanonicalLink = (canonicalUrl?: string) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname || '/'
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const resolvedCanonical = canonicalUrl || `https://www.guialowcarb.com.br${normalizedPath}`

  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', resolvedCanonical)
}

export const setSEO = (
  title: string,
  description: string,
  keywords: string = '',
  ogImage: string = '/og-image.png',
  ogUrl: string = '',
  canonicalUrl: string = '',
) => {
  document.title = title

  const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
    let element = document.querySelector(
      isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`,
    )
    if (!element) {
      element = document.createElement('meta')
      if (isProperty) {
        element.setAttribute('property', nameOrProperty)
      } else {
        element.setAttribute('name', nameOrProperty)
      }
      document.head.appendChild(element)
    }
    element.setAttribute('content', value)
  }

  setMeta('description', description)
  if (keywords) setMeta('keywords', keywords)

  setMeta('og:title', title, true)
  setMeta('og:description', description, true)
  setMeta('og:image', ogImage, true)
  setMeta('og:url', ogUrl || window.location.href, true)
  setMeta('og:type', 'website', true)

  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  setMeta('twitter:image', ogImage)

  updateCanonicalLink(canonicalUrl)
}

export const useSEO = (
  title: string,
  description: string,
  keywords?: string,
  ogImage?: string,
  ogUrl?: string,
  canonicalUrl?: string,
) => {
  useEffect(() => {
    setSEO(title, description, keywords, ogImage, ogUrl, canonicalUrl)
  }, [title, description, keywords, ogImage, ogUrl, canonicalUrl])
}
