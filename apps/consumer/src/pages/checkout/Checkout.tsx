import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'

import {
  Button,
  FormField,
  Input,
  RadioGroup,
  Select,
  Textarea,
} from '@nino/ds'

import type { CreateGuestOrderRequest } from '@custom_types/order/create-guest-order-request'
import { useCreateGuestOrder } from '@hooks/useCreateGuestOrder'
import { useDeliveryZones } from '@hooks/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useCartStore } from '@states/useCartStore'
import { brl } from '@utils/money'
import { CHANNEL_LABEL, PAYMENT_METHOD_LABEL } from '@utils/order-flow'
import { resolveSlug } from '@utils/resolve-slug'
import { displayName, isOpen } from '@utils/store-info'

import { CheckoutSkeleton } from './CheckoutSkeleton'
import type { CheckoutFormValues } from './Checkout.types'
import styles from './Checkout.module.css'

export const Checkout = () => {
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const backHref = pathSlug ? `/${pathSlug}` : '/'

  const { store, isPending: loadingStore } = useStore(slug ?? undefined)
  const { settings } = usePublicSettings(store?.id)
  const { zones } = useDeliveryZones(store?.id)
  const { hours, isPending: loadingHours } = useOpeningHours(store?.id)

  const cart = useCartStore((state) => state.lines)
  const clearCart = useCartStore((state) => state.clear)
  const cartLines = Object.values(cart)

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
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: { channel: 'DELIVERY', paymentMethod: 'CASH' },
  })

  const channel = useWatch({ control, name: 'channel' })
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const deliveryZoneId = useWatch({ control, name: 'deliveryZoneId' })

  const subtotal = cartLines.reduce(
    (total, line) => total + Number(line.item.price) * line.quantity,
    0
  )
  const zone = zones.find(({ id }) => id === deliveryZoneId)
  const deliveryFee = channel === 'DELIVERY' ? Number(zone?.fee ?? 0) : 0
  const total = subtotal + deliveryFee

  const channelOptions = (
    zones.length > 0 ? (['DELIVERY', 'PICKUP'] as const) : (['PICKUP'] as const)
  ).map((value) => ({ value, label: CHANNEL_LABEL[value] }))

  const paymentOptions = (settings?.acceptedPaymentMethods ?? ['CASH']).map(
    (value) => ({ value, label: PAYMENT_METHOD_LABEL[value] })
  )

  const onSubmit = (values: CheckoutFormValues) => {
    if (!store) return

    const payload: CreateGuestOrderRequest = {
      tenantId: store.id,
      channel: values.channel,
      deliveryZoneId: values.channel === 'DELIVERY' ? values.deliveryZoneId : undefined,
      paymentMethod: values.paymentMethod,
      changeFor: values.paymentMethod === 'CASH' ? values.changeFor : undefined,
      guestName: values.guestName,
      guestPhone: values.guestPhone,
      guestZipCode: values.guestZipCode,
      guestStreet: values.guestStreet,
      guestNumber: values.guestNumber,
      guestComplement: values.guestComplement,
      guestNeighborhood: values.guestNeighborhood,
      guestCity: values.guestCity,
      guestState: values.guestState,
      notes: values.notes,
      items: cartLines.map(({ item, quantity }) => ({
        productId: item.id,
        quantity,
        unitPrice: Number(item.price),
      })),
    }

    createOrder(payload, { onSuccess: () => clearCart() })
  }

  if (loadingStore) return <CheckoutSkeleton />

  if (!store) return null

  if (!loadingHours && !isOpen(store, hours)) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          {displayName(store)} fechou — não dá para finalizar o pedido agora.
        </p>
        <Link to={backHref} className={styles.emptyLink}>
          Voltar para a loja
        </Link>
      </div>
    )
  }

  if (created) {
    return (
      <div className={styles.confirmed}>
        <img
          src="/mascot-consumer.svg"
          alt=""
          className={styles.confirmedMascot}
        />
        <h1 className={styles.confirmedTitle}>Pedido enviado!</h1>
        <p className={styles.confirmedText}>
          A loja já recebeu seu pedido. Guarde o código abaixo para
          acompanhar.
        </p>
        <p className={styles.confirmedCode}>{created.id.slice(0, 8)}</p>
        <Button onClick={() => void navigate(backHref)}>
          Voltar para a loja
        </Button>
      </div>
    )
  }

  if (cartLines.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Sua sacola está vazia.</p>
        <Link to={backHref} className={styles.emptyLink}>
          Voltar para o cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to={backHref} className={styles.back} aria-label="Voltar">
          ←
        </Link>
        <h1 className={styles.title}>Finalizar pedido</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Como você quer receber?</h2>
          <Controller
            name="channel"
            control={control}
            render={({ field }) => (
              <RadioGroup
                options={channelOptions}
                value={field.value}
                onValueChange={field.onChange}
                orientation="horizontal"
              />
            )}
          />
        </section>

        {channel === 'DELIVERY' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Endereço de entrega</h2>

            <FormField label="Zona de entrega" error={errors.deliveryZoneId?.message}>
              <Controller
                name="deliveryZoneId"
                control={control}
                rules={{ required: 'Escolha uma zona de entrega' }}
                render={({ field }) => (
                  <Select
                    placeholder="Selecione"
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
              <FormField label="Rua" error={errors.guestStreet?.message}>
                <Input
                  {...register('guestStreet', { required: 'Informe a rua' })}
                />
              </FormField>
              <FormField label="Número" error={errors.guestNumber?.message}>
                <Input
                  {...register('guestNumber', { required: 'Informe o número' })}
                />
              </FormField>
            </div>

            <FormField label="Complemento (opcional)">
              <Input {...register('guestComplement')} />
            </FormField>

            <div className={styles.row}>
              <FormField
                label="Bairro"
                error={errors.guestNeighborhood?.message}
              >
                <Input
                  {...register('guestNeighborhood', {
                    required: 'Informe o bairro',
                  })}
                />
              </FormField>
              <FormField label="CEP (opcional)">
                <Input {...register('guestZipCode')} />
              </FormField>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Seus dados</h2>
          <FormField label="Nome" error={errors.guestName?.message}>
            <Input
              {...register('guestName', { required: 'Informe seu nome' })}
            />
          </FormField>
          <FormField label="Telefone" error={errors.guestPhone?.message}>
            <Input
              type="tel"
              placeholder="(11) 91234-5678"
              {...register('guestPhone', { required: 'Informe seu telefone' })}
            />
          </FormField>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pagamento</h2>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                options={paymentOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          {paymentMethod === 'CASH' && (
            <FormField label="Troco para quanto? (opcional)">
              <Input
                type="number"
                step="0.01"
                min={0}
                {...register('changeFor', { valueAsNumber: true })}
              />
            </FormField>
          )}
        </section>

        <section className={styles.section}>
          <FormField label="Observações (opcional)">
            <Textarea rows={3} {...register('notes')} />
          </FormField>
        </section>

        <section className={styles.summary}>
          {cartLines.map(({ item, quantity }) => (
            <div key={item.id} className={styles.summaryLine}>
              <span>
                {quantity}× {item.name}
              </span>
              <span>{brl(Number(item.price) * quantity)}</span>
            </div>
          ))}
          <div className={styles.summaryLine}>
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          {channel === 'DELIVERY' && (
            <div className={styles.summaryLine}>
              <span>Entrega</span>
              <span>{brl(deliveryFee)}</span>
            </div>
          )}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{brl(total)}</span>
          </div>
        </section>

        {submitFailed && (
          <p className={styles.error}>
            Não foi possível enviar seu pedido. Confira os dados e tente de
            novo.
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className={styles.submit}>
          Confirmar pedido — {brl(total)}
        </Button>
      </form>
    </div>
  )
}
