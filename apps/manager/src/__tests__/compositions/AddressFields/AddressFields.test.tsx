import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { lookupZipCode } from '@nino/lib/services/zip-code.service'

import { AddressFields } from '@compositions/AddressFields/AddressFields'

import { emptyAddressValue, foundAddress } from './AddressFields.mock'

vi.mock('@nino/lib/services/zip-code.service', async () => {
  const actual = await vi.importActual<
    typeof import('@nino/lib/services/zip-code.service')
  >('@nino/lib/services/zip-code.service')
  return { ...actual, lookupZipCode: vi.fn() }
})

const zipInput = () => screen.getByLabelText('CEP')

describe(AddressFields.name, () => {
  it('forwards every digit typed in the zip code field', async () => {
    // Arrange
    const onChange = vi.fn()
    render(<AddressFields value={emptyAddressValue} onChange={onChange} />)

    // Act
    await userEvent.type(zipInput(), '6')

    // Assert
    expect(onChange).toHaveBeenCalledWith({ zipCode: '6' })
  })

  it('fills the address once the zip code lookup resolves', async () => {
    // Arrange
    vi.mocked(lookupZipCode).mockResolvedValue(foundAddress)
    const onChange = vi.fn()
    render(<AddressFields value={emptyAddressValue} onChange={onChange} />)

    // Act
    fireEvent.change(zipInput(), { target: { value: '60110000' } })

    // Assert
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ street: foundAddress.street })
      )
    )
  })

  it('shows a not-found message when the zip code has no match', async () => {
    // Arrange
    vi.mocked(lookupZipCode).mockResolvedValue(null)
    render(<AddressFields value={emptyAddressValue} onChange={vi.fn()} />)

    // Act
    fireEvent.change(zipInput(), { target: { value: '00000000' } })

    // Assert
    expect(
      await screen.findByText(/Não achamos esse CEP/)
    ).toBeInTheDocument()
  })
})
