import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'
import local from './ZoneForm.module.css'

export type ZoneFormProps = {
  isAdding: boolean
  onAdd: (data: {
    minRadiusKm: number
    maxRadiusKm: number
    fee: number
  }) => void
}

export const ZoneForm = ({ isAdding, onAdd }: ZoneFormProps) => {
  const [minRadiusKm, setMinRadiusKm] = useState('0')
  const [maxRadiusKm, setMaxRadiusKm] = useState('')
  const [fee, setFee] = useState('')

  const addZone = () => {
    const value = Number(fee.replace(',', '.'))
    const min = Number(minRadiusKm)
    const max = Number(maxRadiusKm)
    if (Number.isNaN(value) || min < 0 || max <= min) return
    onAdd({ minRadiusKm: min, maxRadiusKm: max, fee: value })
    setMinRadiusKm('0')
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
          Defina o intervalo em quilômetros e o valor da entrega.
        </Text>
      </Box>

      <Box className={local.form}>
        <FormField label="Taxa (R$)" className={local.fee}>
          <Input
            inputMode="decimal"
            placeholder="0,00"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
          />
        </FormField>
        <FormField label="De (km)" className={local.radius}>
          <Input
            inputMode="numeric"
            value={minRadiusKm}
            onChange={(event) => setMinRadiusKm(event.target.value)}
          />
        </FormField>
        <FormField label="Até (km)" className={local.radius}>
          <Input
            inputMode="numeric"
            placeholder="Ex.: 5"
            value={maxRadiusKm}
            onChange={(event) => setMaxRadiusKm(event.target.value)}
          />
        </FormField>
        <Button
          loading={isAdding}
          className={`${motion.press} ${local.submit}`}
          onClick={addZone}
        >
          Adicionar faixa
        </Button>
      </Box>
    </Box>
  )
}
