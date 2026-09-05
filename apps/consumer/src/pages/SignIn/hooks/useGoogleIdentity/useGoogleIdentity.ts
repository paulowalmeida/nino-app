import { useEffect, useRef, useState } from 'react'

import type {
  GoogleIdentityApi,
  GoogleCredentialResponse,
} from '@pages/sign-in/types/GoogleIdentityApi.type'
import {
  GOOGLE_BUTTON,
  GOOGLE_BUTTON_MAX_WIDTH,
  GOOGLE_SDK_SRC,
} from '@pages/sign-in/constants/sign-in.constants'

const getGoogleApi = (): GoogleIdentityApi | undefined =>
  (window as Window & { google?: GoogleIdentityApi }).google

const loadSdk = (): Promise<GoogleIdentityApi | null> => {
  const loaded = getGoogleApi()
  if (loaded) return Promise.resolve(loaded)

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SDK_SRC}"]`
    )
    const script = existing ?? document.createElement('script')

    script.addEventListener('load', () => resolve(getGoogleApi() ?? null))
    script.addEventListener('error', () => resolve(null))

    if (!existing) {
      script.src = GOOGLE_SDK_SRC
      script.async = true
      document.head.appendChild(script)
    }
  })
}

/**
 * Monta o botão oficial do Google dentro do nosso container. Quem desenha o
 * botão é o SDK, porque é ele que carrega a marca, os idiomas e o
 * comportamento acessível que o Google exige — o que controlamos aqui é a
 * largura, para que ele acompanhe a coluna do formulário.
 *
 * Sem client id configurado o hook não quebra a tela: devolve
 * `isConfigured: false` e o caminho do Google simplesmente não aparece.
 */
export const useGoogleIdentity = (onCredential: (idToken: string) => void) => {
  const containerRef = useRef<HTMLElement>(null)
  const [isReady, setIsReady] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  const callbackRef = useRef(onCredential)

  useEffect(() => {
    callbackRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!clientId) return

    let active = true

    let observer: ResizeObserver | undefined
    let painted = 0

    void loadSdk().then((api) => {
      const container = containerRef.current
      if (!active || !api || !container) return

      api.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }: GoogleCredentialResponse) => {
          if (credential) callbackRef.current(credential)
        },
        cancel_on_tap_outside: true,
      })

      /*
       * O SDK desenha um botão de largura fixa: ele não acompanha a coluna
       * sozinho, então quem mede é a gente. Sem redesenhar a cada mudança de
       * largura, o botão sobra para fora do cartão assim que a tela encolhe
       * ou o aparelho gira.
       */
      const paint = () => {
        const measured = Math.round(container.getBoundingClientRect().width)
        /* medida ausente não pode virar botão ausente: a largura padrão
           mantém o caminho do Google visível até a primeira medição real */
        const width = Math.min(
          measured || GOOGLE_BUTTON.width,
          GOOGLE_BUTTON_MAX_WIDTH
        )
        if (width === painted) return

        painted = width
        container.replaceChildren()
        api.accounts.id.renderButton(container, {
          ...GOOGLE_BUTTON,
          width: Math.min(width, GOOGLE_BUTTON_MAX_WIDTH),
        })
        setIsReady(true)
      }

      paint()

      observer = new ResizeObserver(paint)
      observer.observe(container)
    })

    return () => {
      active = false
      observer?.disconnect()
    }
  }, [clientId])

  return { containerRef, isReady, isConfigured: Boolean(clientId) }
}
