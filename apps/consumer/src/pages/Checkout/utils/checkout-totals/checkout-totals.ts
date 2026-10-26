import type { CartLine } from '@custom_types/cart/cart-line'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'
import { largestDiscount } from '@utils/discount/discount'
import { freeDeliveryCoverage } from '@utils/free-delivery/free-delivery'
import { giftApplies } from '@utils/gift/gift'

export type CheckoutTotalsInput = {
  cartLines: CartLine[]
  isDelivery: boolean
  zone: PublicDeliveryZone | undefined
  estimatedMinutes: number | undefined
  freeDelivery?: PublicPromotion
  discountCandidates?: (PublicPromotion | undefined)[]
  giftCandidates?: PublicPromotion[]
  gift?: PublicPromotion
  packageOffer?: PublicPromotion
}

export const checkoutTotals = ({
  cartLines,
  isDelivery,
  zone,
  estimatedMinutes,
  freeDelivery,
  discountCandidates = [],
  giftCandidates = [],
  gift: legacyGift,
  packageOffer,
}: CheckoutTotalsInput) => {
  const subtotal = cartLines.reduce(
    (total, line) =>
      total +
      (line.item.package?.listPrice ?? cartItemPrice(line.item)) *
        line.quantity,
    0
  )
  const deliveryFee = isDelivery ? Number(zone?.fee ?? 0) : 0
  const coverage = freeDeliveryCoverage(freeDelivery, {
    isDelivery,
    zoneId: zone?.id,
    subtotal,
    deliveryFee,
  })
  const deliveryDiscount = coverage === 'applied' ? deliveryFee : 0
  const discount = largestDiscount(discountCandidates, subtotal)
  const packageLine = cartLines.find(({ item }) => !!item.package)
  const packageData = packageLine?.item.package
  const packageSavings =
    packageData &&
    packageOffer &&
    packageOffer.id === packageData.promotionId &&
    subtotal >= packageOffer.minOrderValue
      ? Math.max(0, packageData.listPrice - cartItemPrice(packageLine.item))
      : 0
  const gift = [...giftCandidates, legacyGift]
    .filter((candidate): candidate is PublicPromotion => !!candidate)
    .filter((candidate) => giftApplies(candidate, subtotal))
    .sort(
      (first, second) =>
        (second.giftProduct?.price ?? 0) - (first.giftProduct?.price ?? 0)
    )[0]
  const benefits = [
    packageSavings > 0
      ? { kind: 'package' as const, amount: packageSavings }
      : undefined,
    discount
      ? { kind: 'discount' as const, amount: discount.amount }
      : undefined,
    gift?.giftProduct
      ? { kind: 'gift' as const, amount: gift.giftProduct.price }
      : undefined,
  ].filter((benefit) => !!benefit)
  const selected = benefits.reduce<(typeof benefits)[number] | undefined>(
    (largest, benefit) =>
      !largest || benefit.amount > largest.amount ? benefit : largest,
    undefined
  )
  const appliedPackage = selected?.kind === 'package' ? packageOffer : undefined
  const appliedDiscount =
    selected?.kind === 'discount' ? discount?.promotion : undefined
  const appliedGift = selected?.kind === 'gift' ? gift : undefined
  const promotionDiscount =
    selected?.kind === 'package' || selected?.kind === 'discount'
      ? selected.amount
      : 0
  const total = subtotal + deliveryFee - deliveryDiscount - promotionDiscount
  const deliveryNote = estimatedMinutes
    ? `Chega em ~${estimatedMinutes} min`
    : 'Levamos até você'

  return {
    subtotal,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage: coverage,
    promotionDiscount,
    appliedDiscount,
    appliedGift,
    ...(appliedPackage ? { appliedPackage } : {}),
    total,
    deliveryNote,
  }
}
