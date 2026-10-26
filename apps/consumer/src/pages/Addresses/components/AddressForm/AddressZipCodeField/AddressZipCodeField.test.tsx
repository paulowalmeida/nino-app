import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { AddressZipCodeField } from './AddressZipCodeField'

const TestForm = () => {
  const form = useForm<SaveAddressRequest>()
  return (
    <AddressZipCodeField
      form={form}
      lookup="idle"
      isLookingUp={false}
      lookupAddress={vi.fn()}
      onLookupChange={vi.fn()}
    />
  )
}

describe('AddressZipCodeField', () => {
  it('renders the masked zip field', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
  })
})
