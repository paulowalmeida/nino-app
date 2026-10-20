import { useMemo } from 'react'
import { Link } from 'react-router'

import { Controller, useForm, useWatch } from 'react-hook-form'

import { Accordion } from '@nino/ds/components/Accordion'
import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import {
  emptyPositionFormValues,
  formValuesToDraft,
  groupPermissions,
  lowestPositionId,
  placementOptions,
  type PositionFormValues,
  positionToFormValues,
  togglePermission,
} from '@shared/utils/position-form/position-form'

import { PositionDetailSummary } from '../PositionDetailSummary/PositionDetailSummary'

import motion from '@styles/motion.module.css'
import styles from './PositionDetailForm.module.css'

const FORM_ID = 'position-form'

export const PositionDetailForm = () => {
  const { position, positions, permissionCatalog, savePosition } =
    usePositionDetailFacade()
  const isReadOnly = !!position?.isDefault
  const groups = useMemo(
    () => groupPermissions(permissionCatalog),
    [permissionCatalog]
  )
  const placements = placementOptions(positions, position?.id)

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
  const belowPositionId = useWatch({ control, name: 'belowPositionId' })
  const permissions = useWatch({ control, name: 'permissions' })

  const onSubmit = async (values: PositionFormValues) => {
    try {
      await savePosition(formValuesToDraft(values))
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
        {isReadOnly && !position?.isProtected && (
          <Alert variant="info">
            Este é um cargo padrão e não pode ser alterado. Duplique para criar
            uma versão sua.
          </Alert>
        )}

        <Box as="section" aria-labelledby="position-identity" className={styles.identity}>
          <Heading level={2} size="sm" id="position-identity">
            Identificação
          </Heading>
          <Box className={styles.identityFields}>
            <FormField label="Nome do cargo" error={errors.name?.message}>
              <Input
                placeholder="Ex.: Caixa, Cozinheiro"
                maxLength={40}
                disabled={isReadOnly}
                {...register('name', {
                  validate: (value) =>
                    value.trim().length > 0 || 'Informe o nome do cargo',
                })}
              />
            </FormField>

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
                      disabled={isReadOnly}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </FormField>
            )}
          </Box>
        </Box>

        <Box as="section" aria-labelledby="position-permissions" className={styles.permissions}>
          <Heading level={2} size="sm" id="position-permissions">
            O que este cargo pode fazer
          </Heading>
          <Controller
            name="permissions"
            control={control}
            render={({ field }) => (
              <Accordion
                multiple
                defaultValue={groups.slice(0, 1).map(({ group }) => group)}
                className={styles.groups}
                itemClassName={styles.group}
                items={groups.map(
                  ({ group, label, permissions: definitions }) => ({
                    value: group,
                    trigger: (
                      <Box className={styles.groupTrigger}>
                        <Text as="span" className={styles.groupTitle}>
                          {label}
                        </Text>
                        <Text as="span" className={styles.groupCount}>
                          {`${definitions.filter(({ key }) => field.value.includes(key)).length} de ${definitions.length}`}
                        </Text>
                      </Box>
                    ),
                    content: (
                      <Box direction="column" gap={3}>
                        {definitions.map((definition) => (
                          <FormField
                            key={definition.key}
                            orientation="horizontal"
                            label={definition.label}
                            helperText={definition.description}
                          >
                            <Checkbox
                              checked={field.value.includes(definition.key)}
                              disabled={isReadOnly}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  togglePermission(
                                    field.value,
                                    definition.key,
                                    checked === true
                                  )
                                )
                              }
                            />
                          </FormField>
                        ))}
                      </Box>
                    ),
                  })
                )}
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

      <PositionDetailSummary
        aboveName={
          placements.find(({ value }) => value === belowPositionId)?.label ??
          null
        }
        selectedCount={permissions.length}
        totalCount={permissionCatalog.length}
        memberCount={position?.memberCount ?? 0}
      />
    </form>
  )
}
