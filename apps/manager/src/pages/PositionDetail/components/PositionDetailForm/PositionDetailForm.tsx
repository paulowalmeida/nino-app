import { useState } from 'react'
import { Link } from 'react-router'

import { Controller, useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import {
  emptyPositionFormValues,
  formValuesToDraft,
  lowestPositionId,
  placementOptions,
  type PositionFormValues,
  positionToFormValues,
} from '@shared/utils/position-form/position-form'

import { PositionPermissionsPicker } from '../PositionPermissionsPicker/PositionPermissionsPicker'

import motion from '@styles/motion.module.css'
import styles from './PositionDetailForm.module.css'

const FORM_ID = 'position-form'

export const PositionDetailForm = () => {
  const { position, positions, isCreating, savePosition } =
    usePositionDetailFacade()
  const isReadOnly = !!position?.isProtected
  const placements = placementOptions(positions, position?.id)
  const [term, setTerm] = useState('')

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PositionFormValues>({
    defaultValues: position
      ? positionToFormValues(position)
      : emptyPositionFormValues(lowestPositionId(positions)),
  })

  const onSubmit = async (values: PositionFormValues) => {
    try {
      const { name, ...changes } = formValuesToDraft(values)
      await savePosition(isCreating ? { name, ...changes } : changes)
    } catch {
      setError('root', {
        message:
          'Não foi possível salvar o cargo. Confira se o nome já não existe.',
      })
    }
  }

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className={`${motion.deal} ${styles.layout}`}
    >
      <Box direction="column" gap={8} className={styles.main}>
        <Box className={styles.fields}>
          {isCreating && (
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
          )}

          {!position?.isProtected && (
            <FormField
              label="Fica logo abaixo de"
              helperText="Quem está acima promove quem está abaixo."
            >
              <Controller
                name="belowPositionId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={placements}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </FormField>
          )}

          <FormField label="Filtrar permissões">
            <Input
              type="search"
              value={term}
              placeholder="Nome ou descrição"
              onChange={(event) => setTerm(event.target.value)}
            />
          </FormField>
        </Box>

        <Box as="section" aria-labelledby="position-permissions" className={styles.permissions}>
          <Controller
            name="permissions"
            control={control}
            render={({ field }) => (
              <PositionPermissionsPicker
                value={field.value}
                term={term}
                disabled={isReadOnly}
                onChange={field.onChange}
              />
            )}
          />
        </Box>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

        {!isReadOnly && (
          <Box className={styles.actions}>
            <Button asChild variant="ghost">
              <Link to=".." relative="path">
                Cancelar
              </Link>
            </Button>
            <Button type="submit" form={FORM_ID} loading={isSubmitting}>
              Salvar cargo
            </Button>
          </Box>
        )}
      </Box>
    </form>
  )
}
