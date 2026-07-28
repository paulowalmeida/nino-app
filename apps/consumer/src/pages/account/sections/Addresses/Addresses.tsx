import { useState } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { toast } from '@nino/ds/components/Toast'
import { Icon } from '@components/Icon/Icon'
import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useDeleteAddress } from '@hooks/useDeleteAddress'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useSaveAddress } from '@hooks/useSaveAddress'
import { riseDelay } from '@utils/rise-delay'

import pencilIcon from '@assets/icons/pencil.svg?raw'
import starIcon from '@assets/icons/star.svg?raw'
import trashIcon from '@assets/icons/trash.svg?raw'

import { AddressForm } from './AddressForm'

import styles from './Addresses.module.css'
import section from '../section.module.css'
import motion from '@styles/motion.module.css'

const NEW = 'new'

const lineOf = ({ street, number, complement }: Address): string =>
  [`${street}, ${number}`, complement].filter(Boolean).join(' · ')

const cityOf = ({ neighborhood, city, state, zipCode }: Address): string =>
  `${neighborhood} · ${city}/${state} · ${zipCode}`

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
      data: {
        zipCode: address.zipCode,
        street: address.street,
        number: address.number,
        complement: address.complement ?? undefined,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        isPrimary: true,
      },
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
            {editing === address.id ? (
              <AddressForm
                address={address}
                isSaving={save.isPending}
                hasError={save.isError}
                onCancel={close}
                onSubmit={handleSubmit(address.id)}
              />
            ) : (
              <>
                <div className={styles.body}>
                  <p className={styles.line}>{lineOf(address)}</p>
                  <p className={styles.city}>{cityOf(address)}</p>
                  {address.isPrimary && (
                    <span className={styles.badge}>Principal</span>
                  )}
                </div>

                <div className={styles.tools}>
                  {!address.isPrimary && (
                    <button
                      type="button"
                      className={`${motion.press} ${styles.tool}`}
                      onClick={() => handlePrimary(address)}
                      disabled={save.isPending}
                      aria-label="Tornar principal"
                      title="Tornar principal"
                    >
                      <Icon svg={starIcon} />
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${motion.press} ${styles.tool}`}
                    onClick={() => setEditing(address.id)}
                    aria-label="Editar endereço"
                    title="Editar"
                  >
                    <Icon svg={pencilIcon} />
                  </button>
                  <button
                    type="button"
                    className={`${motion.press} ${styles.tool}`}
                    onClick={() => setConfirming(address.id)}
                    aria-label="Excluir endereço"
                    title="Excluir"
                  >
                    <Icon svg={trashIcon} />
                  </button>
                </div>

                {/* apagar é irreversível: a confirmação nasce na própria
                    linha, sem tirar a lista da frente de quem escolhe */}
                {confirming === address.id && (
                  <div className={styles.confirm}>
                    <p className={styles.confirmText}>Excluir este endereço?</p>
                    <div className={styles.confirmActions}>
                      <button
                        type="button"
                        className={`${motion.press} ${styles.confirmNo}`}
                        onClick={() => setConfirming(null)}
                      >
                        Manter
                      </button>
                      <button
                        type="button"
                        className={`${motion.press} ${styles.confirmYes}`}
                        disabled={remove.isPending}
                        onClick={() =>
                          remove.mutate(address.id, {
                            onSuccess: () => {
                              setConfirming(null)
                              toast.success('Endereço excluído.')
                            },
                            onError: () =>
                              toast.error('Não deu para excluir agora.'),
                          })
                        }
                      >
                        {remove.isPending ? 'Excluindo…' : 'Excluir'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {editing === NEW ? (
        <div className={`${motion.settle} ${styles.newCard}`}>
          <AddressForm
            isSaving={save.isPending}
            hasError={save.isError}
            onCancel={close}
            onSubmit={handleSubmit(null)}
          />
        </div>
      ) : (
        <button
          type="button"
          className={`${motion.press} ${styles.add}`}
          onClick={() => setEditing(NEW)}
        >
          Adicionar endereço
        </button>
      )}
    </div>
  )
}
