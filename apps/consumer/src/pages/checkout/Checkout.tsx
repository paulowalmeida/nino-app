import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Select } from '@nino/ds/components/Select'
import { Textarea } from '@nino/ds/components/Textarea'
import { maskZipCode } from '@nino/ds/masks'
import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import { useCreateGuestOrder } from '@hooks/useCreateGuestOrder'
import { useDeliveryZones } from '@hooks/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useCartStore } from '@states/useCartStore'
import { brl } from '@utils/money'
import { PAYMENT_METHOD_LABEL } from '@utils/order-flow'
import { isCompletePhone, toE164 } from '@utils/phone'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { isOpen } from '@utils/store-info'
import { readLastOrder, writeLastOrder } from '@utils/last-order'

import { CheckoutSkeleton } from './CheckoutSkeleton'
import type { CheckoutFormValues } from './Checkout.types'
import styles from './Checkout.module.css'
import motion from '@styles/motion.module.css'

const BackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M20 12H5m0 0l6-6m-6 6l6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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

  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  /** Lido uma vez: o pedido em andamento de quem já fechou uma sacola. */
  const [lastOrder] = useState(readLastOrder)

  const {
    mutate: createOrder,
    isPending: isSubmitting,
    isError: submitFailed,
    data: created,
  } = useCreateGuestOrder()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: { channel: 'DELIVERY', paymentMethod: 'CASH' },
  })

  const channel = useWatch({ control, name: 'channel' })
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const deliveryZoneId = useWatch({ control, name: 'deliveryZoneId' })

  /** Loja que não entrega não pode ficar com "Entrega" marcado por padrão. */
  useEffect(() => {
    if (!loadingZones && zones.length === 0) setValue('channel', 'PICKUP')
  }, [loadingZones, zones.length, setValue])

  /**
   * A sacola só esvazia depois que a confirmação existe. Limpar junto com o
   * envio faz a tela de sacola vazia piscar no intervalo entre o carrinho
   * (store externa) e o `created` (estado da mutation) se atualizarem.
   */
  useEffect(() => {
    if (created) clearCart()
  }, [created, clearCart])

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

  const isDelivery = channel === 'DELIVERY'

  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cartLines.reduce(
    (total, line) => total + Number(line.item.price) * line.quantity,
    0
  )
  const zone = zones.find(({ id }) => id === deliveryZoneId)
  const deliveryFee = isDelivery ? Number(zone?.fee ?? 0) : 0
  const total = subtotal + deliveryFee

  const paymentOptions = settings?.acceptedPaymentMethods ?? ['CASH']

  const onSubmit = (values: CheckoutFormValues) => {
    if (!store) return

    const payload: CreateGuestOrderRequest = {
      tenantId: store.id,
      channel: values.channel,
      deliveryZoneId: isDelivery ? values.deliveryZoneId : undefined,
      paymentMethod: values.paymentMethod,
      changeFor: values.paymentMethod === 'CASH' ? values.changeFor : undefined,
      guestName: values.guestName,
      guestPhone: toE164(values.guestPhone),
      guestZipCode: isDelivery ? values.guestZipCode : undefined,
      guestStreet: isDelivery ? values.guestStreet : undefined,
      guestNumber: isDelivery ? values.guestNumber : undefined,
      guestComplement: isDelivery ? values.guestComplement : undefined,
      guestNeighborhood: isDelivery ? values.guestNeighborhood : undefined,
      guestCity: values.guestCity,
      guestState: values.guestState,
      notes: values.notes,
      items: cartLines.map(({ item, quantity }) => ({
        productId: item.id,
        quantity,
        unitPrice: Number(item.price),
      })),
    }

    createOrder(payload, {
      onSuccess: (response) => {
        writeLastOrder({
          orderId: response.id,
          token: response.trackingToken,
          slug: slug ?? '',
        })
      },
    })
  }

  if (loadingStore) return <CheckoutSkeleton />

  if (!store) return null

  const storeOpen = loadingHours || isOpen(store, hours)

  if (created) {
    const isPickup = created.channel === 'PICKUP'

    return (
      <div className={styles.confirmed}>
        <img
          src={
            isPickup
              ? '/mascot-consumer-pickup.svg'
              : '/mascot-consumer-delivery.svg'
          }
          alt=""
          className={styles.confirmedMascot}
        />
        <h1 className={styles.confirmedTitle}>Pedido enviado!</h1>
        <p className={styles.confirmedText}>
          {isPickup
            ? 'A loja já recebeu e vai preparar. Guarde o código para retirar no balcão.'
            : 'A loja já recebeu e vai preparar. Guarde o código para acompanhar a entrega.'}
        </p>
        <p className={styles.confirmedCode}>{created.id.slice(0, 8)}</p>
        <Button
          onClick={() =>
            void navigate(
              `${pathSlug ? `/${pathSlug}` : ''}/pedido/${created.id}?token=${created.trackingToken}`
            )
          }
        >
          Acompanhar pedido
        </Button>
        <Button variant="ghost" onClick={() => void navigate(backHref)}>
          Voltar para a loja
        </Button>
      </div>
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

  const deliveryNote = settings?.estimatedMinutes
    ? `Chega em ~${settings.estimatedMinutes} min`
    : 'Levamos até você'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.page}>
      <header className={styles.header}>
        <Link to={backHref} className={styles.back} aria-label="Voltar">
          <BackArrow />
        </Link>
        <div className={styles.headText}>
          <h1 className={styles.title}>Finalizar pedido</h1>
          <p className={styles.storeLine}>
            {store.customName ?? store.company.name}
          </p>
        </div>
      </header>

      <div className={styles.form}>
        <section
          className={`${motion.riseIn} ${styles.receipt}`}
          style={riseDelay(20)}
        >
          <Collapsible
            open={isReceiptOpen}
            onOpenChange={setIsReceiptOpen}
            className='bg-brand-foreground'
            trigger={
              <>
                <span className={styles.receiptHead}>
                  <span className={styles.receiptLabel}>Seu pedido</span>
                  <span className={styles.receiptCount}>
                    {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
                    {brl(subtotal)}
                  </span>
                </span>
                <span className={styles.receiptToggle}>
                  {isReceiptOpen ? 'Ocultar' : 'Ver itens'}
                </span>
              </>
            }
          >
            <div className={styles.receiptItems}>
              {cartLines.map(({ item, quantity }) => (
                <p key={item.id} className={styles.receiptItem}>
                  <span className={styles.receiptName}>
                    <span className={styles.receiptQty}>{quantity}×</span>
                    {item.name}
                  </span>
                  <span>{brl(Number(item.price) * quantity)}</span>
                </p>
              ))}

              <div className={styles.receiptRule} />

              <div className={styles.receiptTally}>
                <p className={styles.receiptTallyRow}>
                  <span>Subtotal</span>
                  <span>{brl(subtotal)}</span>
                </p>
                {isDelivery && (
                  <p className={styles.receiptTallyRow}>
                    <span>Entrega</span>
                    <span>{zone ? brl(deliveryFee) : 'a definir'}</span>
                  </p>
                )}
              </div>
            </div>
          </Collapsible>
        </section>

        <section
          className={`${motion.riseIn} ${styles.block}`}
          style={riseDelay(70)}
        >
          <p className={styles.blockLabel}>Como receber</p>
          <Controller
            name="channel"
            control={control}
            render={({ field }) => (
              <RadioGroup
                variant="card"
                orientation="horizontal"
                aria-label="Como receber"
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  ...(zones.length > 0
                    ? [
                        {
                          value: 'DELIVERY',
                          label: 'Entrega',
                          description: deliveryNote,
                        },
                      ]
                    : []),
                  {
                    value: 'PICKUP',
                    label: 'Retirada',
                    description: 'Você busca na loja',
                  },
                ]}
              />
            )}
          />
        </section>

        {isDelivery && (
          <section
            className={`${motion.riseIn} ${styles.block}`}
            style={riseDelay(20)}
          >
            <p className={styles.blockLabel}>Onde entregar</p>

            <FormField error={errors.deliveryZoneId?.message}>
              <Controller
                name="deliveryZoneId"
                control={control}
                rules={{ required: 'Escolha a região da entrega' }}
                render={({ field }) => (
                  <Select
                    placeholder="Região da entrega"
                    error={!!errors.deliveryZoneId}
                    options={zones.map((z) => ({
                      value: z.id,
                      label: `${z.name} — ${brl(z.fee)}`,
                    }))}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </FormField>

            <div className={styles.row}>
              <FormField error={errors.guestStreet?.message}>
                <Input
                  placeholder="Rua"
                  aria-label="Rua"
                  autoComplete="address-line1"
                  error={!!errors.guestStreet}
                  {...register('guestStreet', { required: 'Informe a rua' })}
                />
              </FormField>
              <FormField error={errors.guestNumber?.message}>
                <Input
                  placeholder="Nº"
                  aria-label="Número"
                  inputMode="numeric"
                  error={!!errors.guestNumber}
                  {...register('guestNumber', { required: 'Informe o nº' })}
                />
              </FormField>
            </div>

            <FormField error={errors.guestNeighborhood?.message}>
              <Input
                placeholder="Bairro"
                aria-label="Bairro"
                autoComplete="address-level3"
                error={!!errors.guestNeighborhood}
                {...register('guestNeighborhood', {
                  required: 'Informe o bairro',
                })}
              />
            </FormField>

            <Collapsible
              className={styles.disclosure}
              trigger={
                <span className={styles.disclosureLabel}>
                  <span className={styles.disclosurePlus} aria-hidden="true">
                    +
                  </span>
                  Complemento, referência ou CEP
                </span>
              }
            >
              <div className={styles.disclosureFields}>
                <Input
                  placeholder="Apto, bloco ou ponto de referência"
                  aria-label="Complemento ou ponto de referência"
                  autoComplete="address-line2"
                  {...register('guestComplement')}
                />
                <MaskedInput
                  mask={maskZipCode}
                  placeholder="CEP"
                  aria-label="CEP"
                  autoComplete="postal-code"
                  {...register('guestZipCode')}
                />
              </div>
            </Collapsible>
          </section>
        )}

        <section
          className={`${motion.riseIn} ${styles.block}`}
          style={riseDelay(120)}
        >
          <p className={styles.blockLabel}>Quem recebe</p>

          <FormField error={errors.guestName?.message}>
            <Input
              placeholder="Seu nome"
              aria-label="Seu nome"
              autoComplete="name"
              error={!!errors.guestName}
              {...register('guestName', { required: 'Informe seu nome' })}
            />
          </FormField>

          <FormField
            error={errors.guestPhone?.message}
            helperText="A loja usa para avisar sobre o pedido"
          >
            <PhoneInput
              aria-label="Telefone"
              autoComplete="tel"
              error={!!errors.guestPhone}
              {...register('guestPhone', {
                required: 'Informe seu telefone',
                validate: (value) =>
                  isCompletePhone(value) || 'Telefone incompleto',
              })}
            />
          </FormField>
        </section>

        <section
          className={`${motion.riseIn} ${styles.block}`}
          style={riseDelay(170)}
        >
          <p className={styles.blockLabel}>Pagamento na entrega</p>

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                variant="card"
                orientation="horizontal"
                aria-label="Forma de pagamento"
                value={field.value}
                onValueChange={field.onChange}
                options={paymentOptions.map((method) => ({
                  value: method,
                  label: PAYMENT_METHOD_LABEL[method],
                }))}
              />
            )}
          />

          {paymentMethod === 'CASH' && (
            <FormField helperText="Deixe vazio se não precisar de troco">
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="Troco para quanto?"
                aria-label="Troco para quanto"
                className={styles.noSpin}
                {...register('changeFor', { valueAsNumber: true })}
              />
            </FormField>
          )}
        </section>

        <section
          className={`${motion.riseIn} ${styles.block}`}
          style={riseDelay(220)}
        >
          <Collapsible
            className={styles.disclosure}
            trigger={
              <span className={styles.disclosureLabel}>
                <span className={styles.disclosurePlus} aria-hidden="true">
                  +
                </span>
                Observação para a loja
              </span>
            }
          >
            <Textarea
              rows={3}
              placeholder="Sem cebola, ponto da carne, portaria…"
              aria-label="Observação para a loja"
              {...register('notes')}
            />
          </Collapsible>
        </section>

        {submitFailed && (
          <Alert variant="error" title="O pedido não foi enviado">
            Confira os campos marcados e toque em confirmar de novo.
          </Alert>
        )}

        {!storeOpen && (
          <Alert variant="warning" title="A loja está fechada agora">
            Sua sacola fica guardada — volte quando ela reabrir.
          </Alert>
        )}
      </div>

      <div className={styles.tearBar}>
        <div className={styles.tearTotals}>
          <span className={styles.tearLabel}>Total</span>
          <AnimatedNumber value={brl(total)} className={styles.tearTotal} />
        </div>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!storeOpen}
          className={styles.submit}
        >
          Confirmar pedido
        </Button>
      </div>
    </form>
  )
}
