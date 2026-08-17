import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CustomerAddresses,
} from '@molecules/CustomerAddresses/CustomerAddresses'

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

  it('shows the primary address in full, out in the open', () => {
    // Arrange / Act
    render(
      <CustomerAddresses addresses={[primaryAddress, secondaryAddress]} />
    )

    // Assert
    expect(
      screen.getByText(/Av\. Paulista, 1000 — Apto 12/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Bela Vista · São Paulo\/SP · CEP 01310-100/)
    ).toBeInTheDocument()
  })

  it('lists every registered address, not only the primary one', () => {
    // Arrange / Act
    render(
      <CustomerAddresses addresses={[primaryAddress, secondaryAddress]} />
    )

    // Assert
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText(/Av\. Rio Branco, 156/)).toBeInTheDocument()
  })

  it('keeps the primary address first even when it comes last', () => {
    // Arrange / Act
    render(
      <CustomerAddresses addresses={[secondaryAddress, primaryAddress]} />
    )

    // Assert
    const streets = screen.getAllByText(/^Av\./)
    expect(streets[0]).toHaveTextContent('Av. Paulista')
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
