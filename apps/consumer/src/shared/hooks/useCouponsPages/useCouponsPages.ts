import { useState } from 'react'

/**
 * As duas páginas do painel de cupons: a lista e o detalhe de um cupom.
 *
 * `shownId` guarda o último cupom aberto: ao voltar, a página de detalhe
 * continua montada enquanto desliza para fora, em vez de esvaziar no meio
 * do movimento.
 */
export const useCouponsPages = (
  open: boolean,
  initialDetailId: string | null | undefined
) => {
  const [detailId, setDetailId] = useState<string | null>(
    initialDetailId ?? null
  )
  const [shownId, setShownId] = useState<string | null>(initialDetailId ?? null)
  const [wasOpen, setWasOpen] = useState(open)

  // WHY: cada abertura recomeça de onde o chamador mandou (a vitrine abre já
  // no cupom tocado; o checkout, na lista).
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setDetailId(initialDetailId ?? null)
      setShownId(initialDetailId ?? null)
    }
  }

  const openDetail = (id: string) => {
    setDetailId(id)
    setShownId(id)
  }
  const back = () => setDetailId(null)

  return { detailId, shownId, isDetail: detailId !== null, openDetail, back }
}
