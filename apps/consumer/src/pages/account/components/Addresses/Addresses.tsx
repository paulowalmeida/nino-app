import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { toast } from '@nino/ds/components/Toast'
import type { Address } from '@custom_types/address/address'
import type {
  SaveAddressRequest,
} from '@custom_types/address/save-address-request'
import { addressSaveRequest } from '@pages/account/adapters/addressSaveRequest.adapter/addressSaveRequest.adapter'
import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { riseDelay } from '@utils/rise-delay'

import { AddressCard } from './AddressCard/AddressCard'
import { AddressForm } from './AddressForm/AddressForm'

import styles from './Addresses.module.css'
import motion from '@styles/motion.module.css'

const NEW = 'new'

export const Addresses = () => {
  const {
    addresses,
    isAddressesPending,
    saveAddress,
    isSavingAddress,
    hasSaveAddressError,
    deleteAddress,
    isDeletingAddress,
  } = useAccountFacade()

  const [editing, setEditing] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  const close = () => setEditing(null)

  const handleSubmit = (id: string | null) => (data: SaveAddressRequest) => {
    saveAddress(
      { id: id ?? undefined, data },
      {
        onSuccess: () => {
          close()
          toast.success(id ? 'Endereço atualizado.' : 'Endereço salvo.')
        },
      }
    )
  }

  const handlePrimary = (address: Address) => {
    saveAddress({
      id: address.id,
      data: { ...addressSaveRequest(address), isPrimary: true },
    })
  }

  return (
    <Box>
      <Eyebrow>Endereços</Eyebrow>
      <Heading level={2} size="lg" color="muted">
        Para onde a loja entrega
      </Heading>
      <Text className={styles.note}>
        O principal já vem preenchido no checkout. Os outros ficam a um toque
        na hora de pedir.
      </Text>

      {isAddressesPending && (
        <>
          <Box className={styles.skRow} />
          <Box className={styles.skRow} />
        </>
      )}

      {!isAddressesPending && addresses?.length === 0 && editing !== NEW && (
        <EmptyState size="md" className={styles.empty}>
          Você ainda não salvou nenhum endereço. O primeiro que salvar vira o
          principal.
        </EmptyState>
      )}

      <Box as="ul" className={styles.list}>
        {addresses?.map((address, index) => (
          <Box
            as="li"
            key={address.id}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(index * 55)}
          >
            <AddressCard
              address={address}
              isEditing={editing === address.id}
              isConfirmingDelete={confirming === address.id}
              isSaving={isSavingAddress}
              hasSaveError={hasSaveAddressError}
              isRemoving={isDeletingAddress}
              onEdit={() => setEditing(address.id)}
              onCancelEdit={close}
              onSubmit={handleSubmit(address.id)}
              onMakePrimary={() => handlePrimary(address)}
              onRequestDelete={() => setConfirming(address.id)}
              onCancelDelete={() => setConfirming(null)}
              onConfirmDelete={() =>
                deleteAddress(address.id, {
                  onSuccess: () => {
                    setConfirming(null)
                    toast.success('Endereço excluído.')
                  },
                  onError: () => toast.error('Não deu para excluir agora.'),
                })
              }
            />
          </Box>
        ))}
      </Box>

      {editing === NEW ? (
        <Box className={`${motion.settle} ${styles.newForm}`}>
          <Text className={styles.newTitle}>Novo endereço</Text>
          <AddressForm
            isSaving={isSavingAddress}
            hasError={hasSaveAddressError}
            onCancel={close}
            onSubmit={handleSubmit(null)}
          />
        </Box>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.add}`}
          onClick={() => setEditing(NEW)}
        >
          Adicionar endereço
        </Button>
      )}
    </Box>
  )
}
