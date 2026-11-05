import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { AddressZipCodeField } from './AddressZipCodeField'

const TestForm = () => {
  const form = useForm<SaveAddressRequest>()
  return <AddressZipCodeField form={form} />
}

describe('AddressZipCodeField', () => {
  it('renders the masked zip field, with no CEP lookup of its own', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.queryByText('Buscando endereço…')).toBeNull()
  })
})
