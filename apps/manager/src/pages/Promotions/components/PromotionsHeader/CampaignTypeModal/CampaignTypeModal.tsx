import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { CAMPAIGN_TYPE_OPTIONS } from '@pages/Promotions/constants/promotions.constants'

import styles from './CampaignTypeModal.module.css'

type CampaignTypeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CampaignTypeModal = ({
  open,
  onOpenChange,
}: CampaignTypeModalProps) => {
  const navigate = useNavigate()
  const [type, setType] = useState(CAMPAIGN_TYPE_OPTIONS[0].value)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={
        <Heading level={2} size="md">
          Que campanha você quer criar?
        </Heading>
      }
      body={
        <Box className={styles.campaignTypeOptions}>
          <RadioGroup
            aria-label="Tipo de campanha"
            variant="card"
            options={CAMPAIGN_TYPE_OPTIONS}
            value={type}
            onValueChange={setType}
          />
        </Box>
      }
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => void navigate('nova')}>Continuar</Button>
        </>
      }
    />
  )
}
