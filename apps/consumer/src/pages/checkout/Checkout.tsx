import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { ChannelFields } from '@compositions/ChannelFields/ChannelFields'
import { CheckoutAlerts } from '@compositions/CheckoutAlerts/CheckoutAlerts'
import { CheckoutFooter } from '@compositions/CheckoutFooter/CheckoutFooter'
import { CheckoutHeader } from '@compositions/CheckoutHeader/CheckoutHeader'
import { CheckoutReceipt } from '@compositions/CheckoutReceipt/CheckoutReceipt'
import { DeliveryAddressFields } from '@compositions/DeliveryAddressFields/DeliveryAddressFields'
import { GuestContactFields } from '@compositions/GuestContactFields/GuestContactFields'
import { OrderConfirmed } from '@compositions/OrderConfirmed/OrderConfirmed'
import { OrderNotesField } from '@compositions/OrderNotesField/OrderNotesField'
import { PaymentMethodFields } from '@compositions/PaymentMethodFields/PaymentMethodFields'
import { useDeliveryZones } from '@hooks/useDeliveryZones'
import { useGuestCheckout } from '@hooks/useGuestCheckout'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { CheckoutSkeleton } from '@skeletons/CheckoutSkeleton/CheckoutSkeleton'
import { useCartStore } from '@states/useCartStore'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { isOpen } from '@utils/store-info'
import { readLastOrder, writeLastOrder } from '@utils/last-order'

import styles from './Checkout.module.css'
import motion from '@styles/motion.module.css'

export const Checkout = () => {
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const backHref = pathSlug ? `/${pathSlug}` : '/'

  const { store, isPending: loadingStore } = useStore(slug ?? undefined)
  const { settings } = usePublicSettings(store?.id)
  const { zones, isPending: loadingZones } = useDeliveryZones(store?.id)
  const { hours, isPending: loadingHours } = useOpeningHours(store?.id)

  const cart = useCartStore((state) => state.lines)
  const clearCart = useCartStore((state) => state.clear)
  const cartLines = Object.values(cart)

  /** Lido uma vez: o pedido em andamento de quem já fechou uma sacola. */
  const [lastOrder] = useState(readLastOrder)

  const {
    register,
    control,
    errors,
    submit,
    isDelivery,
    paymentMethod,
    paymentOptions,
    zone,
    subtotal,
    deliveryFee,
    total,
    deliveryNote,
    created,
    isSubmitting,
    submitFailed,
    isQuoting,
  } = useGuestCheckout({
    store,
    zones,
    isLoadingZones: loadingZones,
    cartLines,
    estimatedMinutes: settings?.estimatedMinutes,
    paymentOptions: settings?.acceptedPaymentMethods ?? ['CASH'],
    clearCart,
    onOrderCreated: (order) =>
      writeLastOrder({
        orderId: order.id,
        token: order.trackingToken,
        slug: slug ?? '',
      }),
  })

  /**
   * `created` vive só em memória: recarregar a confirmação, ou voltar até
   * ela, chega aqui com a sacola já vazia. O pedido em andamento ficou no
   * storage, então o destino é o acompanhamento, não a sacola vazia.
   */
  useEffect(() => {
    if (created || cartLines.length > 0 || !lastOrder) return

    void navigate(
      `${pathSlug ? `/${pathSlug}` : ''}/pedido/${lastOrder.orderId}?token=${lastOrder.token}`,
      { replace: true }
    )
  }, [created, cartLines.length, lastOrder, navigate, pathSlug])

  if (loadingStore) return <CheckoutSkeleton />

  if (!store) return null

  const storeOpen = loadingHours || isOpen(store, hours)

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

  return (
    <form onSubmit={submit} className={styles.page}>
      <CheckoutHeader
        backHref={backHref}
        storeName={store.customName ?? store.company.name}
      />

      <div className={styles.form}>
        <section className={motion.riseIn} style={riseDelay(20)}>
          <CheckoutReceipt
            cartLines={cartLines}
            subtotal={subtotal}
            isDelivery={isDelivery}
            hasZone={!!zone}
            deliveryFee={deliveryFee}
          />
        </section>

        <section className={motion.riseIn} style={riseDelay(70)}>
          <ChannelFields
            control={control}
            hasDeliveryZones={zones.length > 0}
            deliveryNote={deliveryNote}
          />
        </section>

        {isDelivery && (
          <section className={motion.riseIn} style={riseDelay(20)}>
            <DeliveryAddressFields
              control={control}
              register={register}
              errors={errors}
              quote={zone}
              isQuoting={isQuoting}
            />
          </section>
        )}

        <section className={motion.riseIn} style={riseDelay(120)}>
          <GuestContactFields register={register} errors={errors} />
        </section>

        <section className={motion.riseIn} style={riseDelay(170)}>
          <PaymentMethodFields
            control={control}
            register={register}
            paymentMethod={paymentMethod}
            paymentOptions={paymentOptions}
          />
        </section>

        <section className={motion.riseIn} style={riseDelay(220)}>
          <OrderNotesField register={register} />
        </section>

        <CheckoutAlerts
          isSubmitFailed={submitFailed}
          isStoreClosed={!storeOpen}
        />
      </div>

      <CheckoutFooter
        total={total}
        isSubmitting={isSubmitting}
        disabled={!storeOpen}
      />
    </form>
  )
}
