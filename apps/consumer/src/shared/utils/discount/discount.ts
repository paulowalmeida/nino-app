import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

const roundMoney = (value: number) => Math.round(value * 100) / 100

/* CONSTRAINT: mesma conta da API — o mínimo olha o pedido inteiro; o desconto
 * incide só nos itens da campanha, percentual com teto, fixo nunca passa deles. */
export const discountAmount = (
  promotion: PublicPromotion,
  subtotal: number,
  eligibleSubtotal: number = subtotal
): number => {
  if (promotion.type === 'FREE_DELIVERY') return 0
  if (subtotal < promotion.minOrderValue) return 0
  const raw =
    promotion.type === 'FIXED_DISCOUNT'
      ? promotion.value
      : Math.min(
          (eligibleSubtotal * promotion.value) / 100,
          promotion.maxDiscount ?? Infinity
        )
  return roundMoney(Math.min(raw, eligibleSubtotal))
}

/** Sem forma escolhida ainda, a campanha restrita não conta. */
export const acceptsPayment = (
  promotion: PublicPromotion,
  paymentMethod: string | undefined
): boolean =>
  !promotion.paymentMethods?.length ||
  (!!paymentMethod && promotion.paymentMethods.includes(paymentMethod))

/* WHY: um desconto por pedido e o maior vence (spec §2.3); empate fica com o
 * primeiro, que é o cupom digitado quando ele vem antes na lista. */
export const largestDiscount = (
  candidates: (PublicPromotion | undefined)[],
  subtotal: number,
  eligibleSubtotalOf: (promotion: PublicPromotion) => number = () => subtotal
): { promotion: PublicPromotion; amount: number } | undefined =>
  candidates.reduce<{ promotion: PublicPromotion; amount: number } | undefined>(
    (largest, promotion) => {
      if (!promotion) return largest
      const amount = discountAmount(
        promotion,
        subtotal,
        eligibleSubtotalOf(promotion)
      )
      return amount > (largest?.amount ?? 0) ? { promotion, amount } : largest
    },
    undefined
  )

const isDiscount = ({ type }: PublicPromotion) =>
  type === 'PERCENTAGE_DISCOUNT' || type === 'FIXED_DISCOUNT'

/* WHY: desconto não entra sozinho no pedido — com ou sem código, o cliente
 * escolhe na lista de cupons. Estes ficam só para a faixa do cardápio. */
export const automaticDiscounts = (
  promotions: PublicPromotion[] = []
): PublicPromotion[] =>
  promotions
    .filter((promotion) => isDiscount(promotion) && !promotion.code)
    .sort((first, second) => first.minOrderValue - second.minOrderValue)

/** Os descontos que a loja divulga, com ou sem código, para o cliente escolher. */
export const couponSuggestions = (
  promotions: PublicPromotion[] = []
): PublicPromotion[] => promotions.filter(isDiscount)
