import { useEffect, useMemo, useState } from 'react'

type ImagePreloadTarget =
  | string
  | null
  | undefined
  | readonly (string | null | undefined)[]

const normalizeUrls = (target: ImagePreloadTarget): string[] => {
  const values = Array.isArray(target) ? target : [target]
  return [...new Set(values.filter((url): url is string => Boolean(url)))]
}

/**
 * Preloads one or more image files before the owner leaves its skeleton.
 *
 * WHY: o banner e o logo customizados não têm altura/proporção reservada —
 * `.customBanner` é `fit-content` de propósito, e o `.logo` do topo mostra a
 * tinta da loja por baixo enquanto o arquivo baixa. O padrão do DS
 * (`Image.tsx`) resolve isso por item numa lista de fotos com proporção fixa;
 * aqui não existe proporção fixa para reservar, então é o carregamento do
 * arquivo, não só o JSON da loja, que precisa terminar antes da página sair
 * do skeleton — senão o slot mostra sua própria tinta/sombra por um instante
 * entre o skeleton sumir e a arte real aparecer.
 */
export const useImagePreload = (target: ImagePreloadTarget): boolean => {
  const targetKey = normalizeUrls(target).join('\u0000')
  const urls = useMemo(
    () => (targetKey ? targetKey.split('\u0000') : []),
    [targetKey]
  )
  const [loadedTargetKey, setLoadedTargetKey] = useState<string | null>(null)

  useEffect(() => {
    if (urls.length === 0) return

    let remaining = urls.length
    let cancelled = false

    const markLoaded = () => {
      if (cancelled) return
      remaining -= 1
      if (remaining === 0) setLoadedTargetKey(targetKey)
    }

    const cleanups = urls.map((url) => {
      const image = new Image()
      image.src = url

      if (image.complete && image.naturalWidth > 0) {
        markLoaded()
        return () => undefined
      }

      // WHY: uma falha no arquivo não deve travar a página em skeleton para
      // sempre — o slot final ainda mostra seu fallback (marca/monograma).
      image.addEventListener('load', markLoaded)
      image.addEventListener('error', markLoaded)
      return () => {
        image.removeEventListener('load', markLoaded)
        image.removeEventListener('error', markLoaded)
      }
    })

    return () => {
      cancelled = true
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [targetKey, urls])

  return urls.length > 0 && loadedTargetKey !== targetKey
}
