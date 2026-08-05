import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { toast } from '@nino/ds/components/Toast'
import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { addressSaveRequest } from '@adapters/addressSaveRequest.adapter'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useDeleteAddress } from '@hooks/useDeleteAddress'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useSaveAddress } from '@hooks/useSaveAddress'
import { riseDelay } from '@utils/rise-delay'

import { AddressCard } from './AddressCard'
import { AddressForm } from './AddressForm'

import styles from './Addresses.module.css'
import section from '../section.module.css'
import motion from '@styles/motion.module.css'

const NEW = 'new'

/**
 * A agenda de para-onde-entregar. O principal fica no topo e é o que o
 * checkout vai propor — por isso ele é o único que a lista destaca.
 */
export const Addresses = () => {
  const { customer } = useCustomerSession()
  const { data: addresses, isPending } = useMyAddresses(!!customer)
  const save = useSaveAddress()
  const remove = useDeleteAddress()

  const [editing, setEditing] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  const close = () => setEditing(null)

  const handleSubmit = (id: string | null) => (data: SaveAddressRequest) => {
    save.mutate(
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
    save.mutate({
      id: address.id,
      data: { ...addressSaveRequest(address), isPrimary: true },
    })
  }

  return (
    <div>
      <p className={section.eyebrow}>Endereços</p>
      <h2 className={section.headline}>Para onde a loja entrega</h2>
      <p className={section.note}>
        O principal já vem preenchido no checkout. Os outros ficam a um toque
        na hora de pedir.
      </p>

      {isPending && (
        <>
          <div className={section.skRow} />
          <div className={section.skRow} />
        </>
      )}

      {!isPending && addresses?.length === 0 && editing !== NEW && (
        <EmptyState size="md" className={styles.empty}>
          Você ainda não salvou nenhum endereço. O primeiro que salvar vira o
          principal.
        </EmptyState>
      )}

      <ul className={styles.list}>
        {addresses?.map((address, index) => (
          <li
            key={address.id}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(index * 55)}
          >
            <AddressCard
              address={address}
              isEditing={editing === address.id}
              isConfirmingDelete={confirming === address.id}
              isSaving={save.isPending}
              hasSaveError={save.isError}
              isRemoving={remove.isPending}
              onEdit={() => setEditing(address.id)}
              onCancelEdit={close}
              onSubmit={handleSubmit(address.id)}
              onMakePrimary={() => handlePrimary(address)}
              onRequestDelete={() => setConfirming(address.id)}
              onCancelDelete={() => setConfirming(null)}
              onConfirmDelete={() =>
                remove.mutate(address.id, {
                  onSuccess: () => {
                    setConfirming(null)
                    toast.success('Endereço excluído.')
                  },
                  onError: () => toast.error('Não deu para excluir agora.'),
                })
              }
            />
          </li>
        ))}
      </ul>

      {editing === NEW ? (
        <div className={`${motion.settle} ${styles.newForm}`}>
          <p className={styles.newTitle}>Novo endereço</p>
          <AddressForm
            isSaving={save.isPending}
            hasError={save.isError}
            onCancel={close}
            onSubmit={handleSubmit(null)}
          />
        </div>
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
    </div>
  )
}
