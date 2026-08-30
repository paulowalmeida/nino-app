import { useState } from 'react'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { Grid } from '@nino/ds/components/Grid'
import {
  KitchenColumn,
} from '@pages/Kitchen/components/KitchenBoard/KitchenColumn/KitchenColumn'
import {
  KitchenOrderModal,
} from '@pages/Kitchen/components/KitchenOrderModal/KitchenOrderModal'
import { KITCHEN_COLUMNS } from '@pages/Kitchen/constants/kitchen.constants'
import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'
import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import { arrangeOrders } from '@pages/Kitchen/utils/arrange-orders/arrange-orders'
import { kitchenCollision } from '@pages/Kitchen/utils/kitchen-collision/kitchen-collision'
import { orderCook } from '@pages/Kitchen/utils/order-cook/order-cook'
import { KitchenCard } from '@shared/components/KitchenCard/KitchenCard'
import type { Order } from '@shared/types/order/order'
import { orderDestination } from '@shared/utils/order-destination/order-destination'

import styles from './KitchenBoard.module.css'

export type KitchenBoardProps = {
  isCompact: boolean
}

export const KitchenBoard = ({ isCompact }: KitchenBoardProps) => {
  const {
    ordersByStage,
    salesFormats,
    staff,
    preparationMinutes,
    isPending,
    advanceOrder,
    isAdvancing,
    advancingOrderId,
    changeKitchenAssignee,
    isChangingKitchenAssignee,
    changingKitchenOrderId,
    arrangement,
    liftOrder,
    dropOrder,
  } = useKitchenFacade()
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )
  const allOrders = Object.values(ordersByStage).flat()

  const stageFor = (id: string): KitchenStage | null => {
    const column = KITCHEN_COLUMNS.find(({ stage }) => stage === id)

    if (column) return column.stage

    return (
      KITCHEN_COLUMNS.find(({ stage }) =>
        (ordersByStage[stage] ?? []).some((order) => order.id === id)
      )?.stage ?? null
    )
  }

  return (
    <DndContext
      collisionDetection={kitchenCollision}
      sensors={sensors}
      onDragStart={({ active }) => {
        const order = allOrders.find(({ id }) => id === active.id) ?? null
        setActiveOrder(order)
        if (order) liftOrder(order.id)
      }}
      onDragCancel={() => {
        setActiveOrder(null)
        dropOrder(null, null)
      }}
      onDragEnd={({ over }) => {
        const stage = over ? stageFor(String(over.id)) : null
        const orderId = over && stage !== over.id ? String(over.id) : null

        setActiveOrder(null)
        dropOrder(stage, orderId)
      }}
    >
      <Grid className={styles.board}>
        {KITCHEN_COLUMNS.map((column) => (
          <KitchenColumn
            key={column.stage}
            {...column}
            isCompact={isCompact}
            orders={arrangeOrders(
              ordersByStage[column.stage] ?? [],
              arrangement[column.stage]
            )}
            salesFormats={salesFormats}
            staff={staff}
            preparationMinutes={preparationMinutes}
            isPending={isPending}
            isAdvancing={isAdvancing}
            advancingOrderId={advancingOrderId}
            isChangingKitchenAssignee={isChangingKitchenAssignee}
            changingKitchenOrderId={changingKitchenOrderId}
            activeOrder={activeOrder}
            onAdvanceOrder={advanceOrder}
            onChangeKitchenAssignee={changeKitchenAssignee}
            onOpenOrderDetails={setDetailOrder}
          />
        ))}
      </Grid>

      <DragOverlay dropAnimation={null}>
        {activeOrder && (
          <KitchenCard
            order={activeOrder}
            cookName={orderCook(activeOrder, staff) ?? undefined}
            destination={orderDestination(activeOrder, salesFormats)}
            dueMinutes={preparationMinutes}
            isBusy={false}
            isCompact={isCompact}
          />
        )}
      </DragOverlay>

      <KitchenOrderModal
        order={detailOrder}
        salesFormats={salesFormats}
        onOpenChange={(open) => !open && setDetailOrder(null)}
      />
    </DndContext>
  )
}
