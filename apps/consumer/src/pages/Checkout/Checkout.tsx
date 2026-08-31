import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { CheckoutEmptyCart } from '@pages/checkout/components/CheckoutEmptyCart/CheckoutEmptyCart'
import { CheckoutForm } from '@pages/checkout/components/CheckoutForm/CheckoutForm'
import { OrderConfirmed } from '@pages/checkout/components/OrderConfirmed/OrderConfirmed'
import { useCheckoutFacadeValue } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { CheckoutSkeleton } from '@pages/checkout/skeletons/CheckoutSkeleton/CheckoutSkeleton'
import { resolveBackHref } from '@utils/resolve-back-href'
import { resolveSlug } from '@utils/resolve-slug'

import styles from './Checkout.module.css'

export const Checkout = () => {
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const backHref = resolveBackHref(pathSlug)
  const checkout = useCheckoutFacadeValue(pathSlug)
  const { store, cartLines, created, setSlug } = checkout

  useEffect(() => {
    setSlug(slug ?? undefined)
  }, [slug, setSlug])

  const { lastOrder } = checkout

  if (checkout.isStorePending) return <CheckoutSkeleton />

  if (!store) return null

  if (created) {
    const trackingPath = `${pathSlug ? `/${pathSlug}` : ''}/pedido/${created.id}`
    const trackingHref = created.trackingToken
      ? `${trackingPath}?token=${created.trackingToken}`
      : trackingPath

    return (
      <OrderConfirmed
        order={created}
        onTrack={() => void navigate(trackingHref)}
        onBackToStore={() => void navigate(backHref)}
      />
    )
  }

  if (cartLines.length === 0) {
    if (lastOrder) return <CheckoutSkeleton />

    return <CheckoutEmptyCart backHref={backHref} />
  }

  return (
    <Box className={styles.page}>
      <CheckoutForm
        backHref={backHref}
        storeName={store.customName ?? store.company.name}
        isStoreOpen={checkout.isStoreOpen}
        checkout={checkout}
      />
    </Box>
  )
}
