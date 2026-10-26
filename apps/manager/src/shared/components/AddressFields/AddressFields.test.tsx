import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressFields } from './AddressFields'
import { addressFieldsValueMock } from './AddressFields.mock'

describe('AddressFields', () => {
  it('renders the address fields', () => {
    render(
      <AddressFields
        value={addressFieldsValueMock}
        onChange={() => undefined}
      />
    )
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Estado' })).toBeInTheDocument()
  })

  it('renders state and city before the address when location comes first', () => {
    const { container } = render(
      <AddressFields
        locationFirst
        value={addressFieldsValueMock}
        onChange={() => undefined}
      />
    )

    const labels = Array.from(container.querySelectorAll('label')).map(
      (label) => label.textContent
    )

    expect(labels.indexOf('Estado')).toBeLessThan(labels.indexOf('Cidade'))
    expect(labels.indexOf('Cidade')).toBeLessThan(labels.indexOf('CEP'))
  })
})
