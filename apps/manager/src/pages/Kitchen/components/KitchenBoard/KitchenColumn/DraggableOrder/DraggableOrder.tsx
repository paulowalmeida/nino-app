import type { CSSProperties, ReactNode } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Box } from '@nino/ds/components/Box'

import styles from './DraggableOrder.module.css'

export type DraggableOrderProps = {
  children: ReactNode
  style?: CSSProperties
  orderId: string
}

export const DraggableOrder = ({
  children,
  style,
  orderId,
}: DraggableOrderProps) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: orderId })

  const draggableStyle = {
    ...style,
    opacity: isDragging ? 0 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box
      ref={setNodeRef}
      style={draggableStyle}
      className={styles.dragger}
      data-order-id={orderId}
      {...attributes}
      {...listeners}
    >
      {children}
    </Box>
  )
}
