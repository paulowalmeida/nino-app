import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'

export type RemoveZoneModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoneLabel: string
  onConfirm: () => void
}

export const RemoveZoneModal = ({
  open,
  onOpenChange,
  zoneLabel,
  onConfirm,
}: RemoveZoneModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    header={
      <Heading level={2} size="lg">
        Remover faixa?
      </Heading>
    }
    body={
      <Box direction="column" gap={3}>
        <Text size="sm" color="muted">
          A faixa {zoneLabel} deixará de aparecer nas opções de entrega da loja.
          As faixas seguintes serão recalculadas.
        </Text>
        <Text size="sm" color="muted">
          Esta ação não pode ser desfeita.
        </Text>
      </Box>
    }
    footer={
      <>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remover faixa
        </Button>
      </>
    }
  />
)
