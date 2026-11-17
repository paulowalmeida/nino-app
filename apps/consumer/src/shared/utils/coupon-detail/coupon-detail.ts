import type { IconName } from '@nino/ds/components/Icon'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { PROMOTION_PAYMENT_PHRASE } from '@constants/promotionPaymentPhrase.constants'
import { brl } from '@utils/money/money'

export type CouponCondition = {
  key: 'minimum' | 'product' | 'zones' | 'payment' | 'audience'
  icon: IconName
  label: string
  value: string
}

export type CouponValidity = {
  date: string
  /** Só aparece quando o prazo está perto o bastante para pesar na decisão. */
  remaining: string | null
}

const DAY_MS = 24 * 60 * 60 * 1000
const REMAINING_WINDOW_DAYS = 30

const fullDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const capitalized = (text: string) =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`

const zonesCondition = (
  promotion: PublicPromotion,
  zones: PublicDeliveryZone[]
): CouponCondition | null => {
  const isFreeDelivery = promotion.type === 'FREE_DELIVERY'
  if (promotion.allDeliveryZones || !promotion.deliveryZoneIds.length)
    return isFreeDelivery
      ? {
          key: 'zones',
          icon: 'map-pin',
          label: 'Entrega',
          value: 'Toda a área de entrega',
        }
      : null
  const covered = zones.filter(({ id }) => promotion.deliveryZoneIds.includes(id))
  if (!covered.length) return null
  // WHY: no frete grátis a taxa de cada zona é justamente o que o cliente economiza.
  const value = covered
    .map(({ name, fee }) =>
      isFreeDelivery ? `${name} (taxa de ${brl(fee)})` : name
    )
    .join(', ')
  return { key: 'zones', icon: 'map-pin', label: 'Entrega', value }
}

/* WHY: só entra a condição que o cadastro da campanha realmente tem; uma
 * linha vazia ("Pagamento: qualquer") faria o cliente procurar uma restrição
 * que não existe. */
export const couponConditions = (
  promotion: PublicPromotion,
  zones: PublicDeliveryZone[]
): CouponCondition[] => {
  const conditions: CouponCondition[] = []

  if (promotion.minOrderValue > 0)
    conditions.push({
      key: 'minimum',
      icon: 'shopping-bag',
      label: 'Pedido mínimo',
      value: brl(promotion.minOrderValue),
    })

  const product =
    promotion.eligibleProductName ??
    (promotion.eligibleProductIds?.length ? 'Itens selecionados' : null)
  if (product)
    conditions.push({
      key: 'product',
      icon: 'tag',
      label: 'Vale em',
      value: product,
    })

  const zonesRow = zonesCondition(promotion, zones)
  if (zonesRow) conditions.push(zonesRow)

  if (promotion.paymentMethods?.length)
    conditions.push({
      key: 'payment',
      icon: 'credit-card',
      label: 'Pagamento',
      value: capitalized(
        promotion.paymentMethods
          .map((method) => PROMOTION_PAYMENT_PHRASE[method as PaymentMethod])
          .join(', ')
      ),
    })

  if (promotion.firstOrderOnly)
    conditions.push({
      key: 'audience',
      icon: 'user',
      label: 'Quem pode usar',
      value: 'Só no primeiro pedido',
    })

  return conditions
}

const buildStep = (promotion: PublicPromotion): string => {
  if (promotion.eligibleProductName)
    return `Adicione ${promotion.eligibleProductName} à sacola`
  if (promotion.eligibleProductIds?.length)
    return 'Adicione um dos itens participantes à sacola'
  if (promotion.minOrderValue > 0)
    return `Monte uma sacola de pelo menos ${brl(promotion.minOrderValue)}`
  return 'Monte sua sacola'
}

const chooseStep = (promotion: PublicPromotion): string =>
  promotion.code
    ? `Na revisão do pedido, escolha o cupom ou digite ${promotion.code}`
    : 'Na revisão do pedido, escolha o cupom'

/* WHY: o cliente não aplica a oferta automática; os passos dizem só o que
 * ele faz, e o último diz o que ele vê quando funciona. */
export const couponSteps = (promotion: PublicPromotion): string[] => {
  if (promotion.type === 'FREE_DELIVERY')
    return [
      buildStep(promotion),
      'Escolha entrega e confirme seu endereço',
      'O frete sai zerado do total',
    ]
  if (promotion.type === 'GIFT')
    return [
      buildStep(promotion),
      `${promotion.giftProduct?.name ?? 'O brinde'} entra no pedido sozinho`,
      'Pague normalmente',
    ]
  if (promotion.type === 'PACKAGE')
    return [
      'Escolha o combo no cardápio',
      'Monte os itens do combo',
      'O preço fechado entra na sacola',
    ]
  return [
    buildStep(promotion),
    chooseStep(promotion),
    'O desconto aparece no total antes de pagar',
  ]
}

const remainingOf = (end: Date, now: Date): string | null => {
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / DAY_MS)
  if (daysLeft <= 0) return 'Termina hoje'
  if (daysLeft === 1) return 'Termina amanhã'
  if (daysLeft <= REMAINING_WINDOW_DAYS) return `Faltam ${daysLeft} dias`
  return null
}

export const couponValidity = (
  { endsAt }: PublicPromotion,
  now: Date = new Date()
): CouponValidity | null => {
  if (!endsAt) return null
  const end = new Date(endsAt)
  return { date: fullDate.format(end), remaining: remainingOf(end, now) }
}
