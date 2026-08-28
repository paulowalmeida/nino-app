import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Slider } from '@nino/ds/components/Slider'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'
import local from './ZoneForm.module.css'

export type ZoneFormProps = {
  isAdding: boolean
  lastMaxRadiusKm?: number
  onAdd: (data: { maxRadiusKm: number; fee: number }) => void
}

const RADIUS_WINDOW_KM = 20

export const ZoneForm = ({
  isAdding,
  lastMaxRadiusKm = 0,
  onAdd,
}: ZoneFormProps) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState('')

  const nearestKm = lastMaxRadiusKm + 1
  const farthestKm = lastMaxRadiusKm + RADIUS_WINDOW_KM
  const draggedKm = Math.min(
    Math.max(Number(maxRadiusKm) || nearestKm, nearestKm),
    farthestKm
  )
  const [fee, setFee] = useState('')
  const feeValue = Number(fee.replace(',', '.'))
  const maxValue = Number(maxRadiusKm)
  const canAdd =
    maxRadiusKm.trim() !== '' &&
    Number.isInteger(maxValue) &&
    maxValue > lastMaxRadiusKm &&
    fee.trim() !== '' &&
    Number.isFinite(feeValue) &&
    feeValue >= 0 &&
    Math.round(feeValue * 100) === feeValue * 100

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
        min={nearestKm}
        max={farthestKm}
        value={draggedKm}
        onValueChange={(km) => setMaxRadiusKm(String(km))}
      />

      <Box className={local.form}>
        <FormField label="Até (km)" className={local.radius}>
          <Input
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="Ex.: 5"
            value={maxRadiusKm}
            onChange={(event) => setMaxRadiusKm(event.target.value)}
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
