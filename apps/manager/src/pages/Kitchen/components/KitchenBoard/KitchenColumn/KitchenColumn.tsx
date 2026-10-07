import { useDroppable } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { DraggableOrder } from '@pages/Kitchen/components/KitchenBoard/KitchenColumn/DraggableOrder/DraggableOrder'
import { KITCHEN_LOADING_CARDS } from '@pages/Kitchen/constants/kitchen.constants'
import { KitchenCardSkeleton } from '@pages/Kitchen/skeletons/KitchenCardSkeleton/KitchenCardSkeleton'
import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import { dropTarget } from '@pages/Kitchen/utils/drop-target/drop-target'
import { orderCook } from '@pages/Kitchen/utils/order-cook/order-cook'
import { KitchenCard } from '@shared/components/KitchenCard/KitchenCard'
import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import type { StaffMember } from '@shared/types/team/staff-member'
import { orderDestination } from '@shared/utils/order-destination/order-destination'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './KitchenColumn.module.css'

export type KitchenColumnProps = {
  stage: KitchenStage
  title: string
  empty: string
  ownsNextStep: boolean
  isCompact: boolean
  orders: Order[]
  salesFormats: OrderChannel[]
  staff: StaffMember[]
  preparationMinutes: number | undefined
  isPending: boolean
  isAdvancing: boolean
  advancingOrderId: string | undefined
  isChangingKitchenAssignee: boolean
  changingKitchenOrderId: string | undefined
  activeOrder: Order | null
  onAdvanceOrder: (orderId: string, status: OrderStatusKey) => void
  onChangeKitchenAssignee: (change: {
    orderId: string
    kitchenAssigneeId: string | null
  }) => void
  onOpenOrderDetails: (order: Order) => void
}

export const KitchenColumn = ({
  stage,
  title,
  empty,
  ownsNextStep,
  isCompact,
  orders,
  salesFormats,
  staff,
  preparationMinutes,
  isPending,
  isAdvancing,
  advancingOrderId,
  isChangingKitchenAssignee,
  changingKitchenOrderId,
  activeOrder,
  onAdvanceOrder,
  onChangeKitchenAssignee,
  onOpenOrderDetails,
}: KitchenColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: stage })
  const keepsOrderInStage =
    !!activeOrder && orders.some(({ id }) => id === activeOrder.id)
  const acceptsDrop =
    !!activeOrder && (keepsOrderInStage || !!dropTarget(activeOrder, stage))
  const columnClassName = mergeClasses(
    styles.kitchenColumn,
    !ownsNextStep && styles.finished,
    activeOrder && styles.dropRegion,
    acceptsDrop && styles.validDrop,
    activeOrder && !acceptsDrop && styles.invalidDrop,
    isOver && styles.targeted
  )

  return (
    <Box
      ref={setNodeRef}
      as="section"
      className={columnClassName}
      aria-label={title}
      data-kitchen-stage={stage}
      data-drop-valid={activeOrder ? acceptsDrop : undefined}
    >
      <Box
        as="header"
        direction="row"
        align="center"
        className={`${motion.unroll} ${styles.columnHead}`}
      >
        <Heading level={2} className={styles.columnTitle}>
          {title}
        </Heading>
        <Text as="span" className={styles.kitchenColumnCount}>
          {orders.length}
        </Text>
      </Box>

      <Box className={styles.stack}>
        {isPending &&
          KITCHEN_LOADING_CARDS.map((card) => (
            <KitchenCardSkeleton key={card} />
          ))}

        {!isPending && orders.length === 0 && (
          <EmptyState className={styles.kitchenColumnEmpty}>{empty}</EmptyState>
        )}

        <SortableContext
          items={orders.map(({ id }) => id)}
          strategy={rectSortingStrategy}
        >
          {orders.map((order, index) => (
            <DraggableOrder
              key={order.id}
              orderId={order.id}
              style={riseDelay(index * 40)}
            >
              <KitchenCard
                order={order}
                cookName={orderCook(order, staff) ?? undefined}
                destination={orderDestination(order, salesFormats)}
                dueMinutes={preparationMinutes}
                onStep={ownsNextStep ? onAdvanceOrder : undefined}
                staff={staff}
                onCookChange={
                  ownsNextStep
                    ? (kitchenAssigneeId) =>
                        onChangeKitchenAssignee({
                          orderId: order.id,
                          kitchenAssigneeId,
                        })
                    : undefined
                }
                isChangingCook={
                  isChangingKitchenAssignee &&
                  changingKitchenOrderId === order.id
                }
                actionLabel={
                  order.status === 'PREPARING' && ownsNextStep
                    ? 'Finalizar preparo'
                    : undefined
                }
                isBusy={isAdvancing && advancingOrderId === order.id}
                isCompact={isCompact}
                onOpenDetails={() => onOpenOrderDetails(order)}
              />
            </DraggableOrder>
          ))}
        </SortableContext>
      </Box>
    </Box>
  )
}
