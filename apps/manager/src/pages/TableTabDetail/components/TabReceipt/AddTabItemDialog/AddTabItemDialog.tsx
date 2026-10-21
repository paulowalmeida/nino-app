import type { FormEvent } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { Tooltip } from '@nino/ds/components/Tooltip'
import { TabItemModifierPicker } from '@pages/TableTabDetail/components/TabReceipt/AddTabItemDialog/TabItemModifierPicker/TabItemModifierPicker'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'
import { findTabProduct } from '@pages/TableTabDetail/utils/findTabProduct/findTabProduct'
import { isTabModifierSelectionComplete } from '@pages/TableTabDetail/utils/isTabModifierSelectionComplete/isTabModifierSelectionComplete'
import { tabProductOptions } from '@pages/TableTabDetail/utils/tabProductOptions/tabProductOptions'
import { toggleTabModifierOption } from '@pages/TableTabDetail/utils/toggleTabModifierOption/toggleTabModifierOption'
import { toTabItemModifiers } from '@pages/TableTabDetail/utils/toTabItemModifiers/toTabItemModifiers'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import { brl } from '@shared/utils/money/money'

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
  const configurationRef = useRef<HTMLElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [descriptionOverflows, setDescriptionOverflows] = useState(false)
  const product = findTabProduct(menuSections, productId)
  const modifiers = product?.modifiers ?? []
  const canLaunch =
    !!productId && isTabModifierSelectionComplete(modifiers, modifierSelection)

  useLayoutEffect(() => {
    configurationRef.current?.scrollTo({ top: 0 })
  }, [productId])

  useLayoutEffect(() => {
    const description = descriptionRef.current
    if (!description) {
      setDescriptionOverflows(false)
      return
    }

    const measureOverflow = () =>
      setDescriptionOverflows(
        description.scrollHeight > description.clientHeight + 1
      )

    measureOverflow()
    const observer = new ResizeObserver(measureOverflow)
    observer.observe(description)
    return () => observer.disconnect()
  }, [product?.id, product?.description])

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
      size="lg"
      positionerClassName={styles.addTabItemDialogPositioner}
      contentClassName={styles.addTabItemDialogPanel}
      bodyClassName={styles.addTabItemDialogBody}
      footerClassName={styles.addTabItemDialogFooter}
      body={
        <form
          id={ADD_TAB_ITEM_FORM_ID}
          onSubmit={addItem}
          className={styles.addTabItemDialogFields}
        >
          <div className={styles.mobileProductSelector}>
            <div className={styles.mobileProductHeading}>
              <button
                type="button"
                className={styles.mobileBackButton}
                aria-label="Voltar"
                onClick={onClose}
              >
                <Icon name="arrow-left" size="sm" />
              </button>
              <span className={styles.mobileProductTitle}>Produto</span>
            </div>
            <FormField
              label="Produto"
              className={styles.mobileProductField}
            >
              <Select
                options={tabProductOptions(menuSections)}
                placeholder="Escolha o produto"
                value={productId}
                onValueChange={pickProduct}
              />
            </FormField>
          </div>

          <div className={styles.addTabItemDialogScrollableContent}>
            <div className={styles.addTabItemDialogLayout}>
            <section
              className={styles.addTabItemDialogProduct}
              role="group"
              aria-label="Produto"
            >
              <div className={styles.desktopProductSelector}>
                <FormField label="Produto">
                  <Select
                    options={tabProductOptions(menuSections)}
                    placeholder="Escolha o produto"
                    value={productId}
                    onValueChange={pickProduct}
                  />
                </FormField>
              </div>
              {product ? (
                <ItemThumb
                  name={product.name}
                  imageUrl={product.images?.[0]?.url}
                  fallbackUrl={product.fallbackUrl}
                  className={styles.productImage}
                  wrapperClassName={styles.productImageWrapper}
                />
              ) : (
                <div className={styles.productPlaceholder}>
                  <Text size="sm" color="muted">
                    Selecione um produto para configurar o item.
                  </Text>
                </div>
              )}
            </section>

            <section
              ref={configurationRef}
              className={styles.addTabItemDialogConfiguration}
            >
              <div className={styles.productSummary}>
                <Heading level={2} size="lg">
                  {product?.name ?? 'Lançar item'}
                </Heading>
                <div className={styles.productDescriptionSlot}>
                  {product?.description && (
                    <p
                      ref={descriptionRef}
                      className={styles.productDescription}
                    >
                      {product.description}
                    </p>
                  )}
                  {descriptionOverflows && product?.description && (
                    <Tooltip
                      content={product.description}
                      side="bottom"
                      delayDuration={150}
                    >
                      <button
                        type="button"
                        className={styles.showDescription}
                        aria-label={`Ver descrição completa de ${product.name}`}
                      >
                        Ver mais
                      </button>
                    </Tooltip>
                  )}
                </div>
                {product && (
                  <Text className={styles.productPrice}>
                    {brl(product.price)}
                  </Text>
                )}
              </div>

              {product && modifiers.length > 0 ? (
                <TabItemModifierPicker
                  modifiers={modifiers}
                  selection={modifierSelection}
                  onToggle={(modifier, optionId, isChecked) =>
                    setModifierSelection((current) =>
                      toggleTabModifierOption(
                        current,
                        modifier,
                        optionId,
                        isChecked
                      )
                    )
                  }
                />
              ) : (
                <Text
                  size="sm"
                  color="muted"
                  className={styles.configurationEmptyState}
                >
                  {product
                    ? 'Este produto não tem opções adicionais.'
                    : 'As opções do produto aparecem aqui.'}
                </Text>
              )}

              <FormField
                label="Quantidade"
                className={styles.configurationField}
              >
                <NumberInput
                  value={quantity}
                  min={1}
                  max={99}
                  onValueChange={setQuantity}
                />
              </FormField>
              <FormField
                label="Observação (opcional)"
                className={styles.configurationField}
              >
                <Input
                  value={notes}
                  maxLength={280}
                  placeholder="Ex.: sem cebola"
                  onChange={(event) => setNotes(event.target.value)}
                />
              </FormField>
            </section>
            </div>
          </div>
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
