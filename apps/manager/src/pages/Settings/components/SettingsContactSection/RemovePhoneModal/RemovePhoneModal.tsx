import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'

export type RemovePhoneModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  onConfirm: () => void
}

export const RemovePhoneModal = ({
  open,
  onOpenChange,
  phone,
  onConfirm,
}: RemovePhoneModalProps) => (
  <Modal
    open={open}
    onOpenChange={onOpenChange}
    header={<Heading level={2} size="lg">Remover telefone?</Heading>}
    body={
      <Box direction="column" gap={3}>
        <Text size="sm" color="muted">
          O número {phone} deixará de ser exibido como contato da loja.
        </Text>
        <Text size="sm" color="muted">Esta ação não pode ser desfeita.</Text>
      </Box>
    }
    footer={
      <>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remover telefone
        </Button>
      </>
    }
  />
)
