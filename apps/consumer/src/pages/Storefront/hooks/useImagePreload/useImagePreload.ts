import { useEffect, useState } from 'react'

/**
 * WHY: o banner e o logo customizados não têm altura/proporção reservada —
 * `.customBanner` é `fit-content` de propósito, e o `.logo` do topo mostra a
 * tinta da loja por baixo enquanto o arquivo baixa. O padrão do DS
 * (`Image.tsx`) resolve isso por item numa lista de fotos com proporção fixa;
 * aqui não existe proporção fixa para reservar, então é o carregamento do
 * arquivo, não só o JSON da loja, que precisa terminar antes da página sair
 * do skeleton — senão o slot mostra sua própria tinta/sombra por um instante
 * entre o skeleton sumir e a arte real aparecer.
 */
export const useImagePreload = (url: string | null | undefined): boolean => {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return

    const image = new Image()
    image.src = url

    if (image.complete && image.naturalWidth > 0) {
      setLoadedUrl(url)
      return
    }

    const markLoaded = () => setLoadedUrl(url)
    // WHY: uma falha no arquivo não deve travar a página em skeleton para
    // sempre — o slot final ainda mostra seu fallback (marca/monograma).
    image.addEventListener('load', markLoaded)
    image.addEventListener('error', markLoaded)
    return () => {
      image.removeEventListener('load', markLoaded)
      image.removeEventListener('error', markLoaded)
    }
  }, [url])

  return !!url && loadedUrl !== url
}
