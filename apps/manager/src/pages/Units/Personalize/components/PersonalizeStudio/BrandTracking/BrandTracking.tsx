import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { TRACKING_STAGE_FIELDS } from '@pages/Units/constants/tracking.constants'
import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandTracking.module.css'

const SECTION_DESCRIPTION =
  'Os textos que o cliente lê enquanto espera. Em branco, usa o padrão do nino.'

export type BrandTrackingProps = {
  tracking: TrackingDraft
  onChange: (patch: Partial<TrackingDraft>) => void
}

export const BrandTracking = ({ tracking, onChange }: BrandTrackingProps) => {
  const changeStage = (stage: keyof TrackingDraft['stageLabels']) => (
    value: string
  ) =>
    onChange({
      stageLabels: { ...tracking.stageLabels, [stage]: value },
    })

  return (
    <StudioSection title="Acompanhamento" description={SECTION_DESCRIPTION}>
      <Box className={styles.brandTrackingFields}>
        {TRACKING_STAGE_FIELDS.map(({ stage, label, placeholder }) => (
          <FormField key={stage} label={label}>
            <Input
              value={tracking.stageLabels[stage]}
              maxLength={40}
              placeholder={placeholder}
              onChange={(event) => changeStage(stage)(event.target.value)}
            />
          </FormField>
        ))}

        <FormField
          label="Mensagem de espera"
          helperText="Aparece abaixo do status enquanto o pedido não fica pronto."
        >
          <Input
            value={tracking.waitingMessage}
            maxLength={140}
            placeholder="Pode fechar a tela, a gente avisa no WhatsApp."
            onChange={(event) =>
              onChange({ waitingMessage: event.target.value })
            }
          />
        </FormField>
      </Box>
    </StudioSection>
  )
}
