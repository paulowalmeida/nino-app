import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressFields } from './AddressFields'

describe('AddressFields', () => {
  it('renders the address fields', () => {
    render(
      <AddressFields
        value={{
          zipCode: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        }}
        onChange={() => undefined}
      />
    )
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
  })
})
