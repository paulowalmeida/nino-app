import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { CheckoutForm } from '@pages/checkout/components/CheckoutForm/CheckoutForm'
import { OrderConfirmed } from '@pages/checkout/components/OrderConfirmed/OrderConfirmed'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'
import { CheckoutSkeleton } from '@pages/checkout/skeletons/CheckoutSkeleton/CheckoutSkeleton'
import { resolveBackHref } from '@utils/resolve-back-href'
import { resolveSlug } from '@utils/resolve-slug'
import { isOpen } from '@utils/store-info'

import styles from './Checkout.module.css'

export const Checkout = () => {
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const backHref = resolveBackHref(pathSlug)
  const checkout = useCheckoutFacade()
  const { store, cartLines, created, setSlug } = checkout

  useEffect(() => {
    setSlug(slug ?? undefined)
  }, [slug, setSlug])

  const lastOrder = useCheckoutResume(
    pathSlug ?? null,
    created,
    cartLines.length
  )

  if (checkout.isStorePending) return <CheckoutSkeleton />

  if (!store) return null

  if (created) {
    return (
      <OrderConfirmed
        order={created}
        onTrack={() =>
          void navigate(
            `${pathSlug ? `/${pathSlug}` : ''}/pedido/${created.id}?token=${created.trackingToken}`
          )
        }
        onBackToStore={() => void navigate(backHref)}
      />
    )
  }

  if (cartLines.length === 0) {
    if (lastOrder) return <CheckoutSkeleton />

    return (
      <EmptyState
        size="md"
        className={styles.empty}
        title="Sua sacola está vazia"
        action={
          <Link to={backHref} className={styles.emptyLink}>
            Voltar para o cardápio
          </Link>
        }
      />
    )
  }

  const isStoreOpen = checkout.isHoursPending || isOpen(store, checkout.hours)

  return (
    <Box className={styles.page}>
      <CheckoutForm
        backHref={backHref}
        storeName={store.customName ?? store.company.name}
        isStoreOpen={isStoreOpen}
      />
    </Box>
  )
}
