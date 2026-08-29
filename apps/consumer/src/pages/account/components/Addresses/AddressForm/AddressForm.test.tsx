import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { lookupZipCode } from '@nino/lib/services/zip-code.service'

import { AddressForm } from './AddressForm'
import { addressFormMock } from './AddressForm.mock'

type ZipCodeService = typeof import('@nino/lib/services/zip-code.service')

vi.mock('@nino/lib/services/zip-code.service', async (importOriginal) => ({
  ...(await importOriginal<ZipCodeService>()),
  lookupZipCode: vi.fn(),
}))

describe('AddressForm', () => {
  it('keeps the submit button disabled until the address is complete', () => {
    // Arrange
    // Act
    render(
      <AddressForm
        isSaving={false}
        hasError={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeDisabled()
  })

  it('fills the address fields once the zip code lookup resolves', async () => {
    // Arrange
    vi.mocked(lookupZipCode).mockResolvedValue(addressFormMock.lookup)

    // Act
    render(
      <AddressForm
        isSaving={false}
        hasError={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001000' },
    })

    // Assert
    await waitFor(() =>
      expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
    )
    expect(screen.getByDisplayValue('Centro')).toBeInTheDocument()
  })

  it('warns when the zip code is not found', async () => {
    // Arrange
    vi.mocked(lookupZipCode).mockResolvedValue(null)

    // Act
    render(
      <AddressForm
        isSaving={false}
        hasError={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '99999999' },
    })

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText('Não achamos esse CEP. Preencha o endereço abaixo.')
      ).toBeInTheDocument()
    )
  })

  it('submits once every required field is filled in', async () => {
    // Arrange
    const onSubmit = vi.fn()
    vi.mocked(lookupZipCode).mockResolvedValue(addressFormMock.lookup)

    // Act
    render(
      <AddressForm
        isSaving={false}
        hasError={false}
        onCancel={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001000' },
    })
    await waitFor(() =>
      expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
    )
    fireEvent.change(screen.getByLabelText('Nº'), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar endereço' }))

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        zipCode: '01001-000',
        number: '123',
        street: 'Rua das Flores',
      })
    )
  })

  it('shows the cancel button firing onCancel', () => {
    // Arrange
    const onCancel = vi.fn()

    // Act
    render(
      <AddressForm
        isSaving={false}
        hasError={false}
        onCancel={onCancel}
        onSubmit={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
