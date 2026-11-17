import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

/** A ação do rodapé da página de detalhe do cupom. */
export type CouponDetailAction = {
  label: string
  onSelect: (promotion: PublicPromotion) => void
  /** Quando o cupom não vale ainda, o botão fica desligado e mostra o motivo. */
  disabledWhenBlocked: boolean
  /** Frase de apoio sob o botão quando nada bloqueia. */
  note?: string
  /** Botão só onde o painel cobre a tela; ao lado do cardápio ele não leva a lugar nenhum. */
  mobileOnly?: boolean
}
