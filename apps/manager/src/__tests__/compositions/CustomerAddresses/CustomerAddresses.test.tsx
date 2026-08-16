import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CustomerAddresses,
} from '@compositions/CustomerAddresses/CustomerAddresses'

import { primaryAddress, secondaryAddress } from './CustomerAddresses.mock'

describe(CustomerAddresses.name, () => {
  it('shows the empty note with no address registered', () => {
    // Arrange / Act
    render(<CustomerAddresses addresses={[]} />)

    // Assert
    expect(
      screen.getByText('Nenhum endereço registrado ainda.')
    ).toBeInTheDocument()
  })

  it('lists every registered address with its full line', () => {
    // Arrange / Act
    render(
      <CustomerAddresses addresses={[primaryAddress, secondaryAddress]} />
    )

    // Assert
    expect(
      screen.getByText(/Av\. Paulista, 1000 — Apto 12/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Bela Vista · São Paulo\/SP/)).toBeInTheDocument()
    expect(screen.getByText('CEP 01310-100')).toBeInTheDocument()
    expect(screen.getByText(/Av\. Rio Branco, 156/)).toBeInTheDocument()
  })

  it('marks only the primary address', () => {
    // Arrange / Act
    render(
      <CustomerAddresses addresses={[primaryAddress, secondaryAddress]} />
    )

    // Assert
    expect(screen.getAllByText('Principal')).toHaveLength(1)
  })
})
