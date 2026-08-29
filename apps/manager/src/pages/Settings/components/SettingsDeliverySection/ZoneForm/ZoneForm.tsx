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
const MIN_RADIUS_KM = 0.5
const RADIUS_STEP_KM = 0.1

export const ZoneForm = ({
  isAdding,
  lastMaxRadiusKm = 0,
  onAdd,
  onPreviewRadius,
}: ZoneFormProps) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState<number | ''>('')
  const [fee, setFee] = useState('')

  const feeValue = Number(fee.replace(',', '.'))
  const maxValue = maxRadiusKm || 0
  const draggedKm = Math.min(
    Math.max(maxRadiusKm || MIN_RADIUS_KM, MIN_RADIUS_KM),
    MAX_RADIUS_KM
  )
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
    <Box as="section" className={local.section}>
      <Box className={local.intro}>
        <Heading level={3} size="md">
          Nova faixa
        </Heading>
        <Text size="sm" color="subtle">
          {lastMaxRadiusKm > 0
            ? `Começa em ${lastMaxRadiusKm} km, onde a última faixa termina.`
            : 'A primeira faixa começa na porta da loja.'}
        </Text>
      </Box>

      <Slider
        className={local.slider}
        label="Raio em Km da faixa"
        showValue
        min={MIN_RADIUS_KM}
        max={MAX_RADIUS_KM}
        step={RADIUS_STEP_KM}
        value={draggedKm}
        onValueChange={previewRadius}
      />

      <Box className={local.form}>
        <FormField className={local.field} label="Até (km)">
          <NumberInput
            min={MIN_RADIUS_KM}
            max={MAX_RADIUS_KM}
            step={RADIUS_STEP_KM}
            value={maxRadiusKm}
            onValueChange={previewRadius}
          />
        </FormField>
        <FormField className={local.field} label="Taxa de entrega (R$)">
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
