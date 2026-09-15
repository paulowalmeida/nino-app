import { render, renderHook } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import { StoreFormAddressFields } from './StoreFormAddressFields'
import { addressFieldMock } from './StoreFormAddressFields.mock'

describe(StoreFormAddressFields.name, () => {
  it('renders the address inputs', () => {
    const { result } = renderHook(() => useForm<FirstStoreFormValues>())
    render(
      <StoreFormAddressFields
        register={result.current.register}
        errors={{}}
        setValue={result.current.setValue}
        setError={result.current.setError}
      />
    )
    expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(addressFieldMock.number)).toBeInTheDocument()
  })
})
