import { Box } from '@nino/ds/components/Box'
import { AddressCard } from '@pages/Addresses/components/AddressCard/AddressCard'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'
import { riseDelay } from '@utils/rise-delay'

import styles from './AddressesList.module.css'
import motion from '@styles/motion.module.css'

export const AddressesList = () => {
  const { addresses } = useAddressesFacade()

  return (
    <Box as="ul" className={styles.list}>
      {addresses?.map((address, index) => (
        <Box
          as="li"
          key={address.id}
          className={`${motion.deal} ${styles.item}`}
          style={riseDelay(index * 55)}
        >
          <AddressCard address={address} />
        </Box>
      ))}
    </Box>
  )
}
