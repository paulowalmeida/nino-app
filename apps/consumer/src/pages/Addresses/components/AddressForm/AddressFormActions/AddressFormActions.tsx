import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'

import styles from './AddressFormActions.module.css'

type AddressFormActionsProps = {
  isSaving: boolean
  onCancel: () => void
  isValid: boolean
}

export const AddressFormActions = ({
  isSaving,
  onCancel,
  isValid,
}: AddressFormActionsProps) => (
  <Box className={styles.addressFormActions}>
    <Button
      type="submit"
      className={styles.addressFormActionsPrimary}
      disabled={!isValid || isSaving}
    >
      {isSaving ? 'Salvando…' : 'Salvar endereço'}
    </Button>
    <Button
      type="button"
      variant="ghost"
      className={styles.ghost}
      onClick={onCancel}
      disabled={isSaving}
    >
      Cancelar
    </Button>
  </Box>
)
