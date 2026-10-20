import type { FormEvent } from 'react'
import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { Select } from '@nino/ds/components/Select'
import { TabItemModifierPicker } from '@pages/TableTabDetail/components/TabReceipt/AddTabItemDialog/TabItemModifierPicker/TabItemModifierPicker'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'
import { findTabProduct } from '@pages/TableTabDetail/utils/findTabProduct/findTabProduct'
import { isTabModifierSelectionComplete } from '@pages/TableTabDetail/utils/isTabModifierSelectionComplete/isTabModifierSelectionComplete'
import { tabProductOptions } from '@pages/TableTabDetail/utils/tabProductOptions/tabProductOptions'
import { toggleTabModifierOption } from '@pages/TableTabDetail/utils/toggleTabModifierOption/toggleTabModifierOption'
import { toTabItemModifiers } from '@pages/TableTabDetail/utils/toTabItemModifiers/toTabItemModifiers'

import styles from './AddTabItemDialog.module.css'

const ADD_TAB_ITEM_FORM_ID = 'add-tab-item-form'

type AddTabItemDialogProps = {
  open: boolean
  onClose: () => void
}

export const AddTabItemDialog = ({ open, onClose }: AddTabItemDialogProps) => {
  const { menuSections, submitAddItem, isAddingItem } =
    useTableTabDetailFacade()
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [modifierSelection, setModifierSelection] =
    useState<TabModifierSelection>({})
  const modifiers = findTabProduct(menuSections, productId)?.modifiers ?? []
  const canLaunch =
    !!productId && isTabModifierSelectionComplete(modifiers, modifierSelection)

  const resetForm = () => {
    setProductId('')
    setQuantity(1)
    setNotes('')
    setModifierSelection({})
  }

  const pickProduct = (nextProductId: string) => {
    setProductId(nextProductId)
    setModifierSelection({})
  }

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canLaunch) return
    submitAddItem(
      {
        productId,
        quantity,
        notes: notes.trim() || undefined,
        modifiers: toTabItemModifiers(modifierSelection),
      },
      {
        onSuccess: () => {
          resetForm()
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && onClose()}
      ariaLabel="Lançar item"
      positionerClassName={styles.addTabItemDialogPositioner}
      contentClassName={styles.addTabItemDialogPanel}
      bodyClassName={styles.addTabItemDialogBody}
      header={
        <Heading level={2} size="md">
          Lançar item
        </Heading>
      }
      body={
        <form
          id={ADD_TAB_ITEM_FORM_ID}
          onSubmit={addItem}
          className={styles.addTabItemDialogFields}
        >
          <FormField label="Produto">
            <Select
              options={tabProductOptions(menuSections)}
              placeholder="Escolha o produto"
              value={productId}
              onValueChange={pickProduct}
            />
          </FormField>
          <TabItemModifierPicker
            modifiers={modifiers}
            selection={modifierSelection}
            onToggle={(modifier, optionId, isChecked) =>
              setModifierSelection((current) =>
                toggleTabModifierOption(current, modifier, optionId, isChecked)
              )
            }
          />
          <FormField label="Quantidade">
            <NumberInput
              value={quantity}
              min={1}
              max={99}
              onValueChange={setQuantity}
            />
          </FormField>
          <FormField label="Observação (opcional)">
            <Input
              value={notes}
              maxLength={280}
              placeholder="Ex.: sem cebola"
              onChange={(event) => setNotes(event.target.value)}
            />
          </FormField>
        </form>
      }
      footer={
        <Box direction="row" className={styles.addTabItemDialogActions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form={ADD_TAB_ITEM_FORM_ID}
            loading={isAddingItem}
            disabled={!canLaunch}
          >
            Lançar item
          </Button>
        </Box>
      }
    />
  )
}
