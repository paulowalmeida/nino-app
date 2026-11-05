import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitAddressSearch } from '@shared/hooks/unit/useUnitAddressSearch/useUnitAddressSearch'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import { StoreFormAddressFields } from './StoreFormAddressFields'
import {
  pickedStoreAddressMock,
  storeAddressSuggestionMock,
  typedStoreAddressMock,
} from './StoreFormAddressFields.mock'

vi.mock('@shared/hooks/unit/useUnitAddressSearch/useUnitAddressSearch', () => ({
  useUnitAddressSearch: vi.fn(),
}))

const renderFields = (form: UseFormReturn<FirstStoreFormValues>) =>
  render(
    <StoreFormAddressFields
      register={form.register}
      errors={{}}
      control={form.control}
      setValue={form.setValue}
    />
  )

describe(StoreFormAddressFields.name, () => {
  const resolveSelectedAddress = vi.fn()

  beforeEach(() => {
    resolveSelectedAddress.mockResolvedValue(pickedStoreAddressMock)
    vi.mocked(useUnitAddressSearch).mockReturnValue({
      suggestions: [storeAddressSuggestionMock],
      isSearching: false,
      resolveSelectedAddress,
      isResolvingSelectedAddress: false,
    })
  })

  it('asks city and UF first, with no CEP lookup', () => {
    const { result } = renderHook(() => useForm<FirstStoreFormValues>())
    renderFields(result.current)

    expect(screen.getByPlaceholderText('Belém')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('PA')).toBeInTheDocument()
    expect(screen.queryByText('CEP não encontrado')).toBeNull()
  })

  it('fills the form with the place picked on Google', async () => {
    const { result } = renderHook(() =>
      useForm<FirstStoreFormValues>({ defaultValues: typedStoreAddressMock })
    )
    renderFields(result.current)

    fireEvent.blur(screen.getByPlaceholderText('123'))
    fireEvent.click(screen.getByText(storeAddressSuggestionMock.mainText))

    await waitFor(() =>
      expect(result.current.getValues('zipCode')).toBe(
        pickedStoreAddressMock.zipCode
      )
    )
    expect(resolveSelectedAddress).toHaveBeenCalledWith('place-1')
    expect(result.current.getValues('neighborhood')).toBe('Centro')
  })
})
