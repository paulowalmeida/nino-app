import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { toE164 } from '@shared/utils/phone/phone'

import motion from '@styles/motion.module.css'
import local from './PhoneForm.module.css'

export type PhoneFormProps = {
  isAdding: boolean
  onAdd: (phone: string) => void
}

export const PhoneForm = ({ isAdding, onAdd }: PhoneFormProps) => {
  const [phone, setPhone] = useState('')
  const isValid = phone.replace(/\D/g, '').length >= 10

  const addPhone = () => {
    if (!isValid) return
    onAdd(toE164(phone))
    setPhone('')
  }

  return (
    <Box className={local.phoneFormSection}>
      <Box className={local.intro}>
        <Heading level={3} size="md">
          Adicionar telefone
        </Heading>
        <Text size="sm" color="subtle">
          Use um número que sua equipe acompanha durante o atendimento.
        </Text>
      </Box>

      <Box className={local.phoneForm}>
        <FormField label="Telefone" className={local.phoneFormField}>
          <PhoneInput
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </FormField>
        <Button
          loading={isAdding}
          disabled={!isValid}
          className={`${motion.press} ${local.submit}`}
          onClick={addPhone}
        >
          Adicionar telefone
        </Button>
      </Box>
    </Box>
  )
}
