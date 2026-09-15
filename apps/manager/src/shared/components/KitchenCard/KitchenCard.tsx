import type { KeyboardEvent, MouseEvent } from 'react'

import { Avatar } from '@nino/ds/components/Avatar'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ListRow } from '@nino/ds/components/ListRow'
import { Menu } from '@nino/ds/components/Menu'
import { Stamp } from '@nino/ds/components/Stamp'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { useElapsed } from '@shared/hooks/order/useElapsed/useElapsed'
import type { Order } from '@shared/types/order/order'
import type { OrderDestination } from '@shared/types/order/order-destination'
import type { OrderDestinationKind } from '@shared/types/order/order-destination-kind'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { StaffMember } from '@shared/types/team/staff-member'
import type { ElapsedPace } from '@shared/types/ui/elapsed-pace'
import { elapsedVar } from '@shared/utils/elapsed-var/elapsed-var'
import { initialsOf } from '@shared/utils/initials/initials'
import {
  nextStep,
  previousStep,
} from '@shared/utils/order-action-policy/order-action-policy'
import { consumerNameOf } from '@shared/utils/order-consumer/order-consumer'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

import motion from '@styles/motion.module.css'
import styles from './KitchenCard.module.css'

export type KitchenCardProps = {
  order: Order
  destination: OrderDestination | null
  onStep?: (orderId: string, target: OrderStatusKey) => void
  isBusy: boolean
  /** `rollback` desfaz o passo que a cozinha deu, em vez de avançar. */
  direction?: 'advance' | 'rollback'
  /** Prazo de preparo da loja; sem ele a régua cai no piso da parede. */
  dueMinutes?: number
  isCompact?: boolean
  actionLabel?: string
  cookName?: string
  staff?: StaffMember[]
  onCookChange?: (kitchenAssigneeId: string | null) => void
  isChangingCook?: boolean
  onOpenDetails?: () => void
}

const paperClasses: Record<OrderDestinationKind, string> = {
  delivery: styles.paperDelivery,
  pickup: styles.paperPickup,
  counter: styles.paperCounter,
  table: styles.paperTable,
}

const paceClasses: Record<ElapsedPace, string> = {
  fresh: styles.paceFresh,
  closing: styles.paceClosing,
  due: styles.paceDue,
  late: styles.paceLate,
}

export const KitchenCard = ({
  order,
  destination,
  onStep,
  isBusy,
  direction = 'advance',
  dueMinutes,
  isCompact = false,
  actionLabel,
  cookName,
  staff = [],
  onCookChange,
  isChangingCook = false,
  onOpenDetails,
}: KitchenCardProps) => {
  const step = direction === 'rollback' ? previousStep(order) : nextStep(order)
  const itemCount = order.items.reduce(
    (total, { quantity }) => total + quantity,
    0
  )
  const { remaining, isLate, pace, ratio, overdueRatio } = useElapsed(
    order.acceptedAt ?? order.createdAt,
    dueMinutes
  )

  const card = mergeClasses(
    motion.settle,
    styles.card,
    destination ? paperClasses[destination.kind] : styles.paperPlain,
    paceClasses[pace],
    isCompact && styles.compact
  )
  const canChangeCook = !!onCookChange && staff.length > 0
  const cookLabel = cookName
    ? `Alterar chapista: ${cookName}`
    : 'Atribuir chapista'
  const cookAvatar = (
    <Avatar
      aria-hidden="true"
      size="sm"
      fallback={cookName ? initialsOf(cookName) : undefined}
      className={styles.cookAvatar}
    />
  )

  const handleDetailsKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (
      event.target instanceof Element &&
      event.target.closest(
        'button, a, input, select, textarea, [role="menu"], [role="menuitem"]'
      )
    ) {
      return
    }
    event.preventDefault()
    onOpenDetails?.()
  }

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target
    if (
      target instanceof Element &&
      target.closest(
        'button, a, input, select, textarea, [role="menu"], [role="menuitem"]'
      )
    ) {
      return
    }
    onOpenDetails?.()
  }

  return (
    <Box
      as="article"
      className={card}
      style={elapsedVar(ratio, overdueRatio)}
      role={onOpenDetails ? 'button' : undefined}
      tabIndex={onOpenDetails ? 0 : undefined}
      aria-label={
        onOpenDetails
          ? `Ver detalhes do pedido ${ticketNumber(order.orderNumber)}`
          : undefined
      }
      onClick={onOpenDetails ? handleCardClick : undefined}
      onKeyDown={onOpenDetails ? handleDetailsKeyDown : undefined}
    >
      <Box as="header" direction="row" className={styles.head}>
        <Text as="span" className={styles.number}>
          {ticketNumber(order.orderNumber)}
        </Text>
        <Text as="span" className={styles.clock}>
          {remaining}
        </Text>
        {isLate && (
          <Text as="span" className="sr-only">
            Pedido atrasado
          </Text>
        )}
      </Box>

      <Box direction="row" align="center" className={styles.who}>
        {destination && (
          <Badge size="sm" className={styles.destination}>
            {destination.label}
          </Badge>
        )}
        <Text as="span" className={styles.name}>
          {consumerNameOf(order)}
        </Text>
        {canChangeCook ? (
          <Menu
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className={styles.cook}
                aria-label={cookLabel}
                title={cookLabel}
                disabled={isChangingCook}
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                {cookAvatar}
              </Button>
            }
            items={[
              ...staff.map(({ user }) => ({
                value: user.id,
                label: user.name,
                disabled: user.name === cookName,
                onSelect: () => onCookChange(user.id),
              })),
              ...(cookName
                ? [
                    { separator: true } as const,
                    {
                      value: 'clear-cook',
                      label: 'Remover responsável',
                      onSelect: () => onCookChange(null),
                    },
                  ]
                : []),
            ]}
          />
        ) : (
          cookName && (
            <Text
              as="span"
              className={styles.cook}
              title={`Em preparo com ${cookName}`}
              aria-label={`Em preparo com ${cookName}`}
            >
              {cookAvatar}
            </Text>
          )
        )}
      </Box>

      <Box className={styles.ruler} aria-hidden="true">
        <Box className={styles.fill} />
      </Box>

      {isCompact ? (
        <Text as="p" className={styles.summary}>
          {itemCount === 1 ? '1 item' : `${itemCount} itens`}
        </Text>
      ) : (
        <Box as="ul" className={styles.items}>
          {order.items.map((item) => (
            <ListRow
              key={item.id}
              divider="none"
              padding={0}
              gap={0}
              className={styles.item}
            >
              <Stamp size="lg" tone="neutral" className={styles.quantity}>
                {item.quantity}
              </Stamp>
              <Text as="span" className={styles.itemName}>
                {item.product.name}
              </Text>
            </ListRow>
          ))}
        </Box>
      )}

      {order.notes && !isCompact && (
        <Text as="p" className={styles.notes}>
          {order.notes}
        </Text>
      )}

      {step && onStep && (
        <Button
          type="button"
          size="lg"
          loading={isBusy}
          className={mergeClasses(motion.press, styles.action)}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onStep(order.id, step.target)
          }}
        >
          {actionLabel ?? step.label}
        </Button>
      )}
    </Box>
  )
}
