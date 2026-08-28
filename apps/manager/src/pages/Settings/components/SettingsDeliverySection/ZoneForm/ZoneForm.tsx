import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { Slider } from '@nino/ds/components/Slider'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'
import local from './ZoneForm.module.css'

export type ZoneFormProps = {
  isAdding: boolean
  lastMaxRadiusKm?: number
  onAdd: (data: { maxRadiusKm: number; fee: number }) => void
  onPreviewRadius?: (maxRadiusKm: number | null) => void
}

const MAX_RADIUS_KM = 15
const MIN_RADIUS_KM = 1
const RADIUS_STEP_KM = 0.1

export const ZoneForm = ({
  isAdding,
  lastMaxRadiusKm = 0,
  onAdd,
  onPreviewRadius,
}: ZoneFormProps) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState<number | ''>('')

  const farthestKm = MAX_RADIUS_KM
  const draggedKm = Math.min(
    Math.max(maxRadiusKm || MIN_RADIUS_KM, MIN_RADIUS_KM),
    farthestKm
  )
  const [fee, setFee] = useState('')
  const feeValue = Number(fee.replace(',', '.'))
  const maxValue = maxRadiusKm || 0
  const canAdd =
    Number.isFinite(maxValue) &&
    Number.isInteger(maxValue * 10) &&
    maxValue > lastMaxRadiusKm &&
    maxValue <= MAX_RADIUS_KM &&
    fee.trim() !== '' &&
    Number.isFinite(feeValue) &&
    feeValue >= 0 &&
    Math.round(feeValue * 100) === feeValue * 100

  const previewRadius = (km: number) => {
    setMaxRadiusKm(km)
    onPreviewRadius?.(
      Number.isInteger(km * 10) && km > lastMaxRadiusKm && km <= MAX_RADIUS_KM
        ? km
        : null
    )
  }

  const addZone = () => {
    if (!canAdd) return
    onAdd({ maxRadiusKm: maxValue, fee: feeValue })
    setMaxRadiusKm('')
    setFee('')
  }

  return (
    <Box className={local.section}>
      <Box className={local.intro}>
        <Heading level={3} size="md">
          Adicionar faixa
        </Heading>
        <Text size="sm" color="subtle">
          Cada nova faixa começa onde termina a anterior. Acima do último
          limite, a loja não realiza entregas.
        </Text>
      </Box>

      <Slider
        className={local.slider}
        label="Raio em Km da faixa"
        showValue
        min={MIN_RADIUS_KM}
        max={farthestKm}
        step={RADIUS_STEP_KM}
        value={draggedKm}
        onValueChange={previewRadius}
      />

      <Box className={local.form}>
        <FormField label="Até (km)" className={local.radius}>
          <NumberInput
            min={MIN_RADIUS_KM}
            max={MAX_RADIUS_KM}
            step={RADIUS_STEP_KM}
            placeholder="Ex.: 5"
            value={maxRadiusKm}
            onValueChange={previewRadius}
          />
        </FormField>
        <FormField label="Taxa de entrega (R$)" className={local.fee}>
          <Input
            inputMode="decimal"
            placeholder="0,00"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
          />
        </FormField>
        <Button
          loading={isAdding}
          disabled={!canAdd}
          className={`${motion.press} ${local.submit}`}
          onClick={addZone}
        >
          Adicionar faixa
        </Button>
      </Box>
    </Box>
  )
}
