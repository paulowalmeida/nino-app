import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ColorPicker } from '@nino/ds/components/ColorPicker'
import { FileUpload } from '@nino/ds/components/FileUpload'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Select } from '@nino/ds/components/Select'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import {
  EMPTY_UNIT_DRAFT,
  UNIT_TIMEZONES,
} from '@pages/Settings/constants/settings.constants'
import {
  UnitCardSkeleton,
} from '@pages/Settings/skeletons/UnitCardSkeleton/UnitCardSkeleton'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import { FieldHint } from '@shared/components/FieldHint/FieldHint'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { StorePreview } from '../StorePreview/StorePreview'

import motion from '@styles/motion.module.css'
import local from './UnitCard.module.css'

export type UnitCardProps = {
  unit: TenantDetail | undefined
  isPending: boolean
  isSaving: boolean
  /** Company's headquarters — the rank shows in the profile's header. */
  isMain: boolean
  isPromoting: boolean
  onSetMain: () => void
  onSave: (data: UnitDraft) => void
}

const toDraft = (unit: TenantDetail): UnitDraft => ({
  customName: unit.customName ?? '',
  timezone: unit.timezone,
  primaryColor: unit.primaryColor ?? '#FF6B00',
  secondaryColor: unit.secondaryColor ?? '#1F2937',
  tertiaryColor: unit.tertiaryColor ?? '#FFF7ED',
  loadingType: unit.loadingType ?? 'MASCOT',
  zipCode: unit.zipCode,
  street: unit.street,
  number: unit.number,
  complement: unit.complement ?? '',
  neighborhood: unit.neighborhood,
  city: unit.city,
  state: unit.state,
})

export const UnitCard = ({
  unit,
  isPending,
  isSaving,
  isMain,
  isPromoting,
  onSetMain,
  onSave,
}: UnitCardProps) => {
  const [draft, setDraft] = useState<UnitDraft>(EMPTY_UNIT_DRAFT)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<TenantDetail | undefined>(undefined)

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(toDraft(unit))
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  if (isPending) return <UnitCardSkeleton />

  return (
    <Box as="section" className={local.panel}>
      <Box
        as="header"
        gap={3}
        align="start"
        justify="between"
        wrap
        mb={4}
        className={motion.unroll}
      >
        <Box>
          <Heading level={2} size="xl">
            {unit?.customName || 'Esta unidade'}
            {isMain && (
              <Badge size="sm" className={local.main}>
                matriz
              </Badge>
            )}
          </Heading>
          <Text size="sm" color="subtle" mt={1}>
            É o endereço de onde o pedido sai — e o que o cliente vê na loja.
          </Text>
        </Box>

        {!isMain && (
          <Button
            variant="outline"
            size="sm"
            loading={isPromoting}
            className={`${motion.press} ${local.promote}`}
            onClick={onSetMain}
          >
            Tornar matriz
          </Button>
        )}
      </Box>

      <Tabs
        className={local.tabs}
        tabs={[
          {
            value: 'unit',
            label: 'Dados da unidade',
            content: (
              <Box className={local.tabContent}>
                <Box className={local.fields}>
                  <FormField label="Nome da unidade">
                    <Input
                      placeholder="Matriz, Centro, Unidade 2…"
                      value={draft.customName}
                      onChange={(event) =>
                        change({ customName: event.target.value })
                      }
                    />
                  </FormField>

                  <FormField
                    label={
                      <FieldHint
                        label="Link da loja"
                        hint={
                          'Muda só pelo suporte — ' +
                          'links já divulgados quebrariam'
                        }
                      />
                    }
                  >
                    <Input value={unit?.slug ?? ''} disabled readOnly />
                  </FormField>

                  <FormField
                    label={
                      <FieldHint
                        label="Fuso horário"
                        hint={
                          'Define a virada do dia e ' +
                          'o horário de funcionamento'
                        }
                      />
                    }
                  >
                    <Select
                      options={UNIT_TIMEZONES}
                      value={draft.timezone}
                      aria-label="Fuso horário da unidade"
                      onValueChange={(timezone) => change({ timezone })}
                    />
                  </FormField>
                </Box>

                <Box className={local.address}>
                  <Text className={local.groupTitle}>Endereço da unidade</Text>
                  <AddressFields value={draft} onChange={change} />
                </Box>
              </Box>
            ),
          },
          {
            value: 'brand',
            label: 'Personalizar loja',
            content: (
              <Box className={local.brandStudio}>
                <Box className={local.brandIntro}>
                  <Text className={local.groupTitle}>Personalizar loja</Text>
                  <Heading level={3} size="lg">
                    A fachada que o cliente reconhece
                  </Heading>
                  <Text size="sm" color="subtle">
                    Combine imagens e cores. A prévia muda enquanto você
                    escolhe.
                  </Text>
                </Box>

                <StorePreview
                  storeName={draft.customName}
                  primaryColor={draft.primaryColor}
                  secondaryColor={draft.secondaryColor}
                  tertiaryColor={draft.tertiaryColor}
                  logoUrl={unit?.logoUrl}
                  bannerUrl={unit?.bannerUrl}
                  logoFile={draft.logoFile}
                  bannerFile={draft.bannerFile}
                />

                <Box className={local.assetGrid}>
                  <FormField
                    label="Logo"
                    helperText="PNG, JPG, WebP ou AVIF · até 4 MB"
                  >
                    <FileUpload
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
                      }}
                      maxFileSize={4 * 1024 * 1024}
                      triggerLabel="Escolher logo"
                      onFileChange={(files) => change({ logoFile: files[0] })}
                    />
                  </FormField>
                  <FormField
                    label="Banner"
                    helperText="Prefira uma imagem horizontal · até 4 MB"
                  >
                    <FileUpload
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
                      }}
                      maxFileSize={4 * 1024 * 1024}
                      triggerLabel="Escolher banner"
                      onFileChange={(files) => change({ bannerFile: files[0] })}
                    />
                  </FormField>
                </Box>

                <Box className={local.palette}>
                  <FormField label="Cor primária">
                    <ColorPicker
                      value={draft.primaryColor}
                      onValueChange={(primaryColor) => change({ primaryColor })}
                    />
                  </FormField>
                  <FormField label="Cor secundária">
                    <ColorPicker
                      value={draft.secondaryColor}
                      onValueChange={(secondaryColor) =>
                        change({ secondaryColor })
                      }
                    />
                  </FormField>
                  <FormField label="Cor terciária">
                    <ColorPicker
                      value={draft.tertiaryColor}
                      onValueChange={(tertiaryColor) =>
                        change({ tertiaryColor })
                      }
                    />
                  </FormField>
                </Box>

                <FormField
                  label="Carregamento da loja"
                  helperText="O que aparece enquanto o cardápio é preparado"
                >
                  <RadioGroup
                    variant="card"
                    orientation="horizontal"
                    value={draft.loadingType}
                    options={[
                      {
                        value: 'MASCOT',
                        label: 'Nino',
                        description: 'O mascote da marca',
                      },
                      {
                        value: 'SPINNER',
                        label: 'Spinner',
                        description: 'Discreto e direto',
                      },
                      {
                        value: 'DOTS',
                        label: 'Pontos',
                        description: 'Leve e ritmado',
                      },
                    ]}
                    onValueChange={(loadingType) =>
                      change({
                        loadingType: loadingType as UnitDraft['loadingType'],
                      })
                    }
                  />
                </FormField>
              </Box>
            ),
          },
        ]}
      />

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${local.save}`}
        onClick={() => onSave(draft)}
      >
        Salvar unidade
      </Button>
    </Box>
  )
}
