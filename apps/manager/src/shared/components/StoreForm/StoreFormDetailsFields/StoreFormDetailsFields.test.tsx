import { render, renderHook } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import { StoreFormDetailsFields } from './StoreFormDetailsFields'
import { storeDetailsFieldMock } from './StoreFormDetailsFields.mock'

describe(StoreFormDetailsFields.name, () => {
  it('renders the store identity fields and type selector', () => {
    const { result } = renderHook(() => useForm<FirstStoreFormValues>())
    render(
      <StoreFormDetailsFields
        register={result.current.register}
        errors={{}}
        control={result.current.control}
        getValues={result.current.getValues}
        setValue={result.current.setValue}
        typeOptions={storeDetailsFieldMock.typeOptions}
      />
    )
    expect(screen.getByPlaceholderText('Lanchonete do Zé')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('lanchonete-do-ze')).toBeInTheDocument()
    expect(screen.getByText('Selecione')).toBeInTheDocument()
  })
})
