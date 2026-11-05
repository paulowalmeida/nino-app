import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { useStoreAddressSearch } from '@shared/hooks/useStoreAddressSearch/useStoreAddressSearch'

import { AddressFormFields } from './AddressFormFields'
import {
  addressFieldSuggestionMock,
  pickedAddressMock,
  typedAddressMock,
} from './AddressFormFields.mock'

vi.mock('@shared/hooks/useStoreAddressSearch/useStoreAddressSearch')

const renderFields = (form: UseFormReturn<SaveAddressRequest>) =>
  render(<AddressFormFields form={form} storeId="unit-1" storeState="PA" />)

describe('AddressFormFields', () => {
  const resolveSelectedAddress = vi.fn()

  beforeEach(() => {
    resolveSelectedAddress.mockReset()
    vi.mocked(useStoreAddressSearch).mockReturnValue({
      suggestions: [addressFieldSuggestionMock],
      isSearching: false,
      isSearchError: false,
      retrySearch: vi.fn(),
      resolveSelectedAddress,
      isResolvingSelectedAddress: false,
    })
  })

  it('renders the complete address field set', () => {
    const { result } = renderHook(() => useForm<SaveAddressRequest>())
    renderFields(result.current)
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('Rua')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByLabelText('UF')).toBeInTheDocument()
  })

  it('searches the store context on Google and fills the picked place', async () => {
    resolveSelectedAddress.mockResolvedValue(pickedAddressMock)
    const { result } = renderHook(() =>
      useForm<SaveAddressRequest>({ defaultValues: typedAddressMock })
    )
    renderFields(result.current)

    fireEvent.blur(screen.getByLabelText('Nº'))
    fireEvent.click(screen.getByText(addressFieldSuggestionMock.mainText))

    await waitFor(() =>
      expect(result.current.getValues('zipCode')).toBe('66000-000')
    )
    expect(useStoreAddressSearch).toHaveBeenLastCalledWith(
      'unit-1',
      'PA',
      'Rua das Flores',
      '26',
      false
    )
    expect(result.current.getValues('city')).toBe('Belém')
  })

  it('says when the store does not deliver to the picked place', async () => {
    resolveSelectedAddress.mockRejectedValue(new Error('422'))
    const { result } = renderHook(() =>
      useForm<SaveAddressRequest>({ defaultValues: typedAddressMock })
    )
    renderFields(result.current)

    fireEvent.blur(screen.getByLabelText('Nº'))
    fireEvent.click(screen.getByText(addressFieldSuggestionMock.mainText))

    expect(
      await screen.findByText('A loja não entrega nesse endereço.')
    ).toBeInTheDocument()
  })
})
