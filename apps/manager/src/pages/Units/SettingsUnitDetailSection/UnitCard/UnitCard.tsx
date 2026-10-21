import { useRef, useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Combobox } from '@nino/ds/components/Combobox'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { toUnitDraft } from '@pages/Units/adapters/toUnitDraft/toUnitDraft'
import { EMPTY_UNIT_DRAFT } from '@pages/Units/constants/unit.constants'
import { useDeliveryLocation } from '@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation'
import { useUnitAddressSearch } from '@pages/Units/hooks/useUnitAddressSearch/useUnitAddressSearch'
import { UnitCardSkeleton } from '@pages/Units/skeletons/UnitCardSkeleton/UnitCardSkeleton'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import { BRAZIL_STATES } from '@shared/constants/address.constants'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'
import { storeDisplayUrlFor } from '@shared/utils/store-url/store-url'

import motion from '@styles/motion.module.css'
import local from './UnitCard.module.css'

export type UnitCardProps = {
  unit: UnitDetail | undefined
  isPending: boolean
  isSaving: boolean
  /** Company's headquarters — the rank shows in the profile's header. */
  isMain: boolean
  isPromoting: boolean
  onSetMain: () => void
  onSave: (data: UnitDraft) => void
}

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
  const [seed, setSeed] = useState<UnitDetail | undefined>(undefined)
  const [addressLookupRequested, setAddressLookupRequested] = useState(false)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const searchedAddress = useRef('')

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(toUnitDraft(unit))
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const addressSearch = useUnitAddressSearch(
    unit?.id ?? null,
    draft.street,
    draft.number,
    draft.state,
    draft.city,
    addressLookupRequested
  )
  const addressLocation = useDeliveryLocation(draft.state)
  const addressDisabled = !draft.state
  const storeUrl = unit?.slug
    ? storeDisplayUrlFor(unit.slug, window.location.hostname)
    : ''
  const storeSlug = unit?.slug ?? ''
  const storeSlugIndex = storeSlug ? storeUrl.indexOf(storeSlug) : -1
  const storeUrlSuffix =
    storeSlugIndex >= 0
      ? storeUrl.slice(storeSlugIndex + storeSlug.length)
      : ''

  const stateField = (
    <Select
      options={BRAZIL_STATES}
      value={draft.state}
      disabled={addressSearch.isResolvingSelectedAddress}
      aria-label="Estado do endereço"
      onValueChange={(state) => {
        change({ state, city: '' })
        setAddressLookupRequested(false)
        setSelectionError(null)
      }}
    />
  )

  const cityField = (
    <Combobox
      options={(addressLocation.municipalities.data ?? []).map(({ nome }) => ({
        value: nome,
        label: nome,
      }))}
      placeholder="Busque uma cidade"
      ariaLabel="Cidade"
      inputValue={draft.city}
      loading={addressLocation.municipalities.isLoading}
      disabled={
        addressDisabled ||
        addressLocation.municipalities.isError ||
        addressSearch.isResolvingSelectedAddress
      }
      onInputValueChange={(city) => change({ city })}
      onValueChange={(city) => change({ city })}
    />
  )

  const clearAddressSelection = (patch: Partial<UnitDraft>) => {
    if ('complement' in patch) {
      change(patch)
      return
    }

    setAddressLookupRequested(false)
    setSelectionError(null)
    change(patch)
  }

  const startAddressLookup = () => {
    const street = draft.street.trim()
    const number = draft.number.trim()
    const state = draft.state.trim()
    const city = draft.city.trim()
    if (!street || !number || !state || !city) return

    const typedAddress = `${street}, ${number}`
    if (typedAddress === searchedAddress.current) return

    searchedAddress.current = typedAddress
    setAddressLookupRequested(true)
  }

  const selectAddress = async (placeId: string) => {
    setAddressLookupRequested(false)
    setSelectionError(null)
    try {
      const address: AddressSearchResult =
        await addressSearch.resolveSelectedAddress(placeId)
      change({
        zipCode: address.zipCode,
        street: address.street,
        number: address.number || draft.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      })
      searchedAddress.current = `${address.street}, ${address.number || draft.number}`
    } catch {
      setSelectionError(
        'Não foi possível preencher esse endereço. Escolha outra sugestão.'
      )
    }
  }

  const streetField = (
    <Input
      placeholder="Rua, avenida, travessa…"
      aria-label="Endereço"
      value={draft.street}
      disabled={addressDisabled || addressSearch.isResolvingSelectedAddress}
      onChange={(event) =>
        clearAddressSelection({ street: event.target.value })
      }
      onBlur={startAddressLookup}
    />
  )

  const isConfirmingAddress = Boolean(
    addressLookupRequested || addressSearch.isResolvingSelectedAddress
  )
  const isLoadingAddresses =
    addressSearch.isSearching || addressSearch.isResolvingSelectedAddress
  const addressResults = isLoadingAddresses ? (
    <Box direction="column" gap={1.5} aria-live="polite">
      <Text size="sm" color="subtle">
        Procurando {draft.street}, {draft.number}…
      </Text>
      {['first', 'second', 'third'].map((row) => (
        <Skeleton key={row} className={local.addressOptionPlaceholder} />
      ))}
    </Box>
  ) : addressSearch.suggestions.length > 0 ? (
    <Box direction="column" gap={1.5}>
      {addressSearch.suggestions.map((suggestion) => (
        <Button
          key={suggestion.placeId}
          type="button"
          variant="ghost"
          onClick={() => void selectAddress(suggestion.placeId)}
          className={local.addressOption}
        >
          <Icon name="map-pin" size="sm" className={local.addressPin} />
          <Box direction="column" gap={0.5} className={local.addressText}>
            <Text as="span" size="sm" weight="semibold">
              {suggestion.mainText}
            </Text>
            <Text as="span" size="xs" color="subtle">
              {suggestion.secondaryText}
            </Text>
          </Box>
        </Button>
      ))}
    </Box>
  ) : (
    <Text color="subtle">
      Nenhum endereço encontrado. Confira o endereço e o número.
    </Text>
  )

  if (isPending) return <UnitCardSkeleton />

  const renderSaveButton = () => (
    <Button
      size="md"
      loading={isSaving}
      disabled={!isDirty}
      className={`${motion.press} ${local.save}`}
      onClick={() => onSave(draft)}
    >
      Salvar
    </Button>
  )

  return (
    <Box as="section" className={local.unitCardPanel}>
      <Header
        className={motion.deal}
        level={2}
        size="xl"
        mb={4}
        title={unit?.customName || 'Esta unidade'}
        description="É o endereço de onde o pedido sai."
        actions={
          <Box direction="row" gap={2} wrap className={local.headerActions}>
            {isMain && (
              <Badge size="sm" className={local.unitCardMain}>
                matriz
              </Badge>
            )}
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
        }
      />

              <Box className={local.tabContent}>
                <Box className={local.unitCardFields}>
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
                    <div className={local.storeUrlComposer}>
                      <Input
                        className={local.storeUrlSlug}
                        style={{
                          width: `${Math.max(storeSlug.length + 16, 24)}ch`,
                        }}
                        value={storeSlug}
                        readOnly
                      />
                      <Text
                        size="sm"
                        color="subtle"
                        className={local.storeUrlAffix}
                      >
                        {storeUrlSuffix}
                      </Text>
                    </div>
                  </FormField>
                </Box>

                <Box className={local.address}>
                  <Text className={local.groupTitle}>Endereço da unidade</Text>
                  {isConfirmingAddress ? (
                    <Box direction="column" gap={2} className={local.confirm}>
                      <Button
                        type="button"
                        variant="ghost"
                        className={local.confirmBack}
                        disabled={addressSearch.isResolvingSelectedAddress}
                        onClick={() => setAddressLookupRequested(false)}
                      >
                        <Icon name="arrow-left" size="sm" />
                        Confirme o endereço
                      </Button>
                      <Text size="sm" color="subtle">
                        Escolha a opção encontrada para preencher o endereço.
                      </Text>
                      {selectionError && (
                        <Text size="sm" color="danger">
                          {selectionError}
                        </Text>
                      )}
                      {addressResults}
                    </Box>
                  ) : (
                    <>
                      {selectionError && (
                        <Text size="sm" color="danger" className="mb-3">
                          {selectionError}
                        </Text>
                      )}
                      <AddressFields
                        value={draft}
                        streetField={streetField}
                        cityField={cityField}
                        stateField={stateField}
                        locationFirst
                        requiresState
                        onChange={clearAddressSelection}
                        onNumberBlur={startAddressLookup}
                      />
                    </>
                  )}
                </Box>
                <Box mt={4}>{renderSaveButton()}</Box>
              </Box>
    </Box>
  )
}
