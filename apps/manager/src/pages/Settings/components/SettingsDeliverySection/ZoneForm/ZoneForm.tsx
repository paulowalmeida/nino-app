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
  onAdd: (data: { name: string; fee: number }) => void
}

export const ZoneForm = ({ isAdding, onAdd }: ZoneFormProps) => {
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')

  const addZone = () => {
    const value = Number(fee.replace(',', '.'))
    if (!name.trim() || Number.isNaN(value)) return
    onAdd({ name: name.trim(), fee: value })
    setName('')
    setFee('')
  }

  return (
    <Box className={local.section}>
      <Box className={local.intro}>
        <Heading level={3} size="md">Adicionar região</Heading>
        <Text size="sm" color="subtle">
          Cada região recebe uma taxa. Use 0,00 para entrega grátis.
        </Text>
      </Box>

      <Box className={local.form}>
        <FormField label="Nome da região" className={local.name}>
          <Input
            placeholder="Ex.: Centro"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
        <FormField label="Taxa (R$)" className={local.fee}>
          <Input
            inputMode="decimal"
            placeholder="0,00"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
          />
        </FormField>
        <Button
          loading={isAdding}
          disabled={!name.trim()}
          className={`${motion.press} ${local.submit}`}
          onClick={addZone}
        >
          Adicionar região
        </Button>
      </Box>
    </Box>
  )
}
