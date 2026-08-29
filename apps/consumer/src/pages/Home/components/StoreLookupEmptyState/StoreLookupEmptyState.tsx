import type { ReactNode } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'

import styles from './StoreLookupEmptyState.module.css'

type StoreLookupEmptyStateProps = {
  mascotSrc: string
  title: string
  children: ReactNode
}

/** As duas telas de "não achamos a loja": link inválido ou slug sem loja. */
export const StoreLookupEmptyState = ({
  mascotSrc,
  title,
  children,
}: StoreLookupEmptyStateProps) => (
  <EmptyState
    size="md"
    className={styles.notFound}
    illustration={<Image src={mascotSrc} alt="" />}
    title={title}
  >
    {children}
  </EmptyState>
)
