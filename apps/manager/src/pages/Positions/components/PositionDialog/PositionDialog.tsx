import { useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { Text } from '@nino/ds/components/Text'
import {
  emptyPositionFormValues,
  formValuesToDraft,
  groupPermissions,
  type PositionFormValues,
  positionToFormValues,
  togglePermission,
} from '@pages/Positions/adapters/position-form.adapter/position-form.adapter'
import { POSITION_LEVEL_LIMITS } from '@pages/Positions/constants/positions.constants'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import styles from './PositionDialog.module.css'

type PositionDialogProps = {
  open: boolean
  /** Cargo being edited; `null` creates a new one. */
  position: UnitPosition | null
  onOpenChange: (open: boolean) => void
}

const FORM_ID = 'position-form'

export const PositionDialog = ({
  open,
  position,
  onOpenChange,
}: PositionDialogProps) => {
  const { permissionCatalog, createPosition, updatePosition } =
    usePositionsFacade()
  const title = position ? 'Editar cargo' : 'Novo cargo'

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PositionFormValues>({
    defaultValues: emptyPositionFormValues(POSITION_LEVEL_LIMITS.initial),
  })

  useEffect(() => {
    if (!open) return
    reset(
      position
        ? positionToFormValues(position)
        : emptyPositionFormValues(POSITION_LEVEL_LIMITS.initial)
    )
  }, [open, position, reset])

  const onSubmit = async (values: PositionFormValues) => {
    const draft = formValuesToDraft(values)
    try {
      if (position) await updatePosition({ positionId: position.id, draft })
      else await createPosition(draft)
      onOpenChange(false)
    } catch {
      setError('root', {
        message:
          'Não foi possível salvar o cargo. Confira se o nome já não existe.',
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={title}
      size="lg"
      header={<h2 className={styles.title}>{title}</h2>}
      body={
        <form
          id={FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <FormField label="Nome do cargo" error={errors.name?.message}>
            <Input
              placeholder="Ex.: Caixa, Cozinheiro"
              maxLength={40}
              {...register('name', {
                validate: (value) =>
                  value.trim().length > 0 || 'Informe o nome do cargo',
              })}
            />
          </FormField>

          <FormField
            label="Nível"
            helperText={
              'Quem tem nível maior pode promover quem tem nível menor. ' +
              'Vai de 1 a 99.'
            }
          >
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value}
                  min={POSITION_LEVEL_LIMITS.min}
                  max={POSITION_LEVEL_LIMITS.max}
                  onValueChange={field.onChange}
                />
              )}
            />
          </FormField>

          <Controller
            name="permissions"
            control={control}
            render={({ field }) => (
              <Box direction="column" gap={4}>
                {groupPermissions(permissionCatalog).map(
                  ({ group, label, permissions }) => (
                    <Box
                      key={group}
                      as="section"
                      aria-label={label}
                      direction="column"
                      gap={2}
                      className={styles.group}
                    >
                      <Text as="p" className={styles.groupTitle}>
                        {label}
                      </Text>
                      {permissions.map((permission) => (
                        <FormField
                          key={permission.key}
                          orientation="horizontal"
                          label={permission.label}
                          helperText={permission.description}
                        >
                          <Checkbox
                            checked={field.value.includes(permission.key)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                togglePermission(
                                  field.value,
                                  permission.key,
                                  checked === true
                                )
                              )
                            }
                          />
                        </FormField>
                      ))}
                    </Box>
                  )
                )}
              </Box>
            )}
          />

          {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
        </form>
      }
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID} loading={isSubmitting}>
            Salvar cargo
          </Button>
        </>
      }
    />
  )
}
