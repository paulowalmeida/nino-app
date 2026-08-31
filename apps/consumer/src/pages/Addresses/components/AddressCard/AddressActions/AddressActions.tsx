import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import type { Address } from '@custom_types/address/address'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import styles from './AddressActions.module.css'
import motion from '@styles/motion.module.css'

type AddressActionsProps = { address: Address }

export const AddressActions = ({ address }: AddressActionsProps) => {
  const {
    startEditingAddress,
    requestDeleteAddress,
    makeAddressPrimary,
    isSavingAddress,
  } = useAddressesFacade()

  return (
    <Box className={styles.tools}>
      {!address.isPrimary && (
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.tool}`}
          onClick={() => makeAddressPrimary(address)}
          disabled={isSavingAddress}
          aria-label="Tornar principal"
          title="Tornar principal"
        >
          <Icon name="star" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.tool}`}
        onClick={() => startEditingAddress(address.id)}
        aria-label="Editar endereço"
        title="Editar"
      >
        <Icon name="pencil" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.tool}`}
        onClick={() => requestDeleteAddress(address.id)}
        aria-label="Excluir endereço"
        title="Excluir"
      >
        <Icon name="trash" />
      </Button>
    </Box>
  )
}
