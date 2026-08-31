import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { AddressFormFields } from './AddressFormFields'

const TestForm = () => {
  const form = useForm<SaveAddressRequest>()
  return (
    <AddressFormFields
      form={form}
      lookup="idle"
      isLookingUp={false}
      lookupAddress={vi.fn()}
      onLookupChange={vi.fn()}
    />
  )
}

describe('AddressFormFields', () => {
  it('renders the complete address field set', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('Rua')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByLabelText('UF')).toBeInTheDocument()
  })
})
