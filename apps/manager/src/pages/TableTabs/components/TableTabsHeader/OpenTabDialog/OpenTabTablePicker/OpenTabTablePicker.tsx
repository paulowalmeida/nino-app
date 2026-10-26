import { Button } from '@nino/ds/components/Button'
import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { DiningTableSeat } from '@pages/TableTabs/types/DiningTableSeat.type'

import styles from './OpenTabTablePicker.module.css'

const SEAT_SKELETON_KEYS = ['first', 'second', 'third', 'fourth'] as const

type OpenTabTablePickerProps = {
  diningTableSeats: DiningTableSeat[]
  isLoadingSeats: boolean
  isOpening: boolean
  onSeatSelect: (seat: DiningTableSeat) => void
  onTabReady: (tabId: string) => void
  selectedSeatId: string | null
}

export const OpenTabTablePicker = ({
  diningTableSeats,
  isLoadingSeats,
  isOpening,
  onSeatSelect,
  onTabReady,
  selectedSeatId,
}: OpenTabTablePickerProps) => {
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
    onSeatSelect(seat)
  }

  return (
    <Grid
      columns={{ mobile: 3, tablet: 4 }}
      gap={2}
      role="group"
      aria-label="Mesas"
    >
      {diningTableSeats.map((seat) => {
        const isSelected = selectedSeatId === seat.id

        return (
          <Button
            key={seat.id}
            type="button"
            variant={seat.openTabId || isSelected ? 'secondary' : 'outline'}
            loading={isOpening && isSelected}
            disabled={isOpening}
            aria-pressed={seat.openTabId ? undefined : isSelected}
            aria-label={
              seat.openTabId
                ? `${seat.name}, comanda aberta: ver comanda`
                : `${seat.name}: selecionar`
            }
            className={styles.openTabTablePickerSeat}
            onClick={() => chooseSeat(seat)}
          >
            <span className={styles.openTabTablePickerName}>{seat.name}</span>
            {(seat.openTabId || isSelected) && (
              <span className={styles.openTabTablePickerState}>
                {seat.openTabId ? 'Aberta' : 'Selecionada'}
              </span>
            )}
          </Button>
        )
      })}
    </Grid>
  )
}
