import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import type {
  CreateSubscriptionInterestInput,
  SubscriptionInterestContactMethod,
} from '@shared/types/profile/subscription-interest'

import { useSubscriptionInterestFacade } from '../../../facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'

import styles from './SubscriptionInterestForm.module.css'

type InterestDraft = {
  contactName: string
  contactEmail: string
  contactPhone: string
  preferredContactMethod: SubscriptionInterestContactMethod
  unitCount: string
  needs: string
  desiredFeatures: string
}

type InterestField = keyof InterestDraft
type InterestErrors = Partial<Record<InterestField, string>>

type SubscriptionInterestFormProps = {
  onInterestSent: () => void
}

const initialDraft: InterestDraft = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  preferredContactMethod: 'EMAIL',
  unitCount: '',
  needs: '',
  desiredFeatures: '',
}

const contactOptions = [
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'PHONE', label: 'Telefone' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const SubscriptionInterestForm = ({
  onInterestSent,
}: SubscriptionInterestFormProps) => {
  const navigate = useNavigate()
  const { requestInterest, isRequestingInterest, isRequestInterestError } =
    useSubscriptionInterestFacade()
  const [draft, setDraft] = useState(initialDraft)
  const [errors, setErrors] = useState<InterestErrors>({})

  const change = <Field extends InterestField>(
    field: Field,
    value: InterestDraft[Field]
  ) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = (): CreateSubscriptionInterestInput | null => {
    const nextErrors: InterestErrors = {}
    const unitCount = Number(draft.unitCount)

    if (!draft.contactName.trim()) nextErrors.contactName = 'Informe seu nome.'
    if (!emailPattern.test(draft.contactEmail.trim())) {
      nextErrors.contactEmail = 'Informe um e-mail válido.'
    }
    if (
      draft.preferredContactMethod !== 'EMAIL' &&
      !draft.contactPhone.trim()
    ) {
      nextErrors.contactPhone = 'Informe um telefone para esse canal.'
    }
    if (!Number.isInteger(unitCount) || unitCount < 1) {
      nextErrors.unitCount = 'Informe pelo menos uma unidade.'
    }
    if (!draft.needs.trim()) {
      nextErrors.needs = 'Conte o que sua operação precisa.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return null

    return {
      contactName: draft.contactName.trim(),
      contactEmail: draft.contactEmail.trim(),
      contactPhone: draft.contactPhone.trim() || undefined,
      preferredContactMethod: draft.preferredContactMethod,
      unitCount,
      needs: draft.needs.trim(),
      desiredFeatures: draft.desiredFeatures.trim() || undefined,
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = validate()
    if (!input) return

    requestInterest(input, { onSuccess: onInterestSent })
  }

  return (
    <form
      className={styles.subscriptionInterestForm}
      onSubmit={submit}
      noValidate
    >
      <Box gap={6}>
        <Alert variant="info" title="Contratação sob consulta">
          O plano Rede é desenhado para operações com mais unidades ou
          necessidades específicas. Ainda não há preço definido nesta etapa.
        </Alert>

        <Box gap={3}>
          <Text as="p" role="heading" aria-level={2} size="lg" weight="bold">
            Como podemos falar com você?
          </Text>
          <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
            <FormField label="Nome" required error={errors.contactName}>
              <Input
                value={draft.contactName}
                autoComplete="name"
                onChange={(event) => change('contactName', event.target.value)}
              />
            </FormField>
            <FormField label="E-mail" required error={errors.contactEmail}>
              <Input
                type="email"
                value={draft.contactEmail}
                autoComplete="email"
                onChange={(event) => change('contactEmail', event.target.value)}
              />
            </FormField>
            <FormField
              label="Telefone"
              error={errors.contactPhone}
              helperText={
                draft.preferredContactMethod === 'EMAIL'
                  ? 'Opcional quando o retorno for por e-mail.'
                  : undefined
              }
            >
              <PhoneInput
                aria-label="Telefone"
                value={draft.contactPhone}
                autoComplete="tel"
                onChange={(event) => change('contactPhone', event.target.value)}
              />
            </FormField>
            <FormField label="Prefiro contato por" required>
              <Select
                options={contactOptions}
                value={draft.preferredContactMethod}
                onValueChange={(value) =>
                  change(
                    'preferredContactMethod',
                    value as SubscriptionInterestContactMethod
                  )
                }
              />
            </FormField>
          </Grid>
        </Box>

        <Box gap={3}>
          <Text as="p" role="heading" aria-level={2} size="lg" weight="bold">
            Sobre a operação
          </Text>
          <FormField
            label="Quantidade de unidades"
            required
            error={errors.unitCount}
            helperText="Considere as unidades que você pretende operar no plano Rede."
          >
            <Input
              type="number"
              min={1}
              value={draft.unitCount}
              onChange={(event) => change('unitCount', event.target.value)}
            />
          </FormField>
          <FormField
            label="O que sua operação precisa?"
            required
            error={errors.needs}
            helperText="Descreva o contexto, o desafio ou o resultado esperado."
          >
            <Textarea
              rows={5}
              value={draft.needs}
              onChange={(event) => change('needs', event.target.value)}
            />
          </FormField>
          <FormField
            label="Recursos ou integrações importantes"
            helperText="Opcional. Ex.: integrações, suporte dedicado ou regras específicas."
          >
            <Textarea
              rows={4}
              value={draft.desiredFeatures}
              onChange={(event) =>
                change('desiredFeatures', event.target.value)
              }
            />
          </FormField>
        </Box>

        {isRequestInterestError && (
          <Alert variant="error">
            Não foi possível enviar a solicitação agora. Seus dados foram
            preservados; tente novamente.
          </Alert>
        )}

        <Box
          direction={{ mobile: 'column', tablet: 'row' }}
          justify={{ tablet: 'end' }}
          gap={3}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate('..', { relative: 'path' })}
          >
            Voltar
          </Button>
          <Button type="submit" loading={isRequestingInterest}>
            Enviar solicitação
          </Button>
        </Box>
      </Box>
    </form>
  )
}
