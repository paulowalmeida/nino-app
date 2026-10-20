import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'
import type { DiningTableSeat } from '@pages/TableTabs/types/DiningTableSeat.type'

import styles from './OpenTabTablePicker.module.css'

const SEAT_SKELETON_KEYS = ['first', 'second', 'third', 'fourth'] as const

type OpenTabTablePickerProps = {
  onTabReady: (tabId: string) => void
}

export const OpenTabTablePicker = ({ onTabReady }: OpenTabTablePickerProps) => {
  const { diningTableSeats, isLoadingSeats, submitOpen, isOpening } =
    useTableTabsFacade()
  const [openingTableId, setOpeningTableId] = useState<string | null>(null)

  if (isLoadingSeats) {
    return (
      <Grid columns={{ mobile: 3, tablet: 4 }} gap={2} aria-hidden>
        {SEAT_SKELETON_KEYS.map((key) => (
          <Skeleton key={key} className={styles.openTabTablePickerSkeleton} />
        ))}
      </Grid>
    )
  }

  if (diningTableSeats.length === 0) {
    return (
      <Text size="sm" color="muted">
        Nenhuma mesa cadastrada. Cadastre em Configurações, Salão e comandas,
        ou abra a comanda pelo nome do cliente.
      </Text>
    )
  }

  const chooseSeat = (seat: DiningTableSeat) => {
    if (seat.openTabId) {
      onTabReady(seat.openTabId)
      return
    }
    setOpeningTableId(seat.id)
    submitOpen(
      { diningTableId: seat.id },
      {
        onSuccess: (tab) => onTabReady(tab.id),
        onSettled: () => setOpeningTableId(null),
      }
    )
  }

  return (
    <Grid
      columns={{ mobile: 3, tablet: 4 }}
      gap={2}
      role="group"
      aria-label="Mesas"
    >
      {diningTableSeats.map((seat) => (
        <Button
          key={seat.id}
          type="button"
          variant={seat.openTabId ? 'secondary' : 'outline'}
          loading={openingTableId === seat.id}
          disabled={isOpening && openingTableId !== seat.id}
          aria-label={
            seat.openTabId
              ? `${seat.name}, comanda aberta: ver comanda`
              : `${seat.name}: abrir comanda`
          }
          className={styles.openTabTablePickerSeat}
          onClick={() => chooseSeat(seat)}
        >
          <span className={styles.openTabTablePickerName}>{seat.name}</span>
          {seat.openTabId && (
            <span className={styles.openTabTablePickerState}>Aberta</span>
          )}
        </Button>
      ))}
    </Grid>
  )
}
