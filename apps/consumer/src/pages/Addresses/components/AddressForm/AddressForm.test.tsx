import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressForm } from './AddressForm'
import { addressFormMock } from './AddressForm.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')
vi.mock('@nino/ds/components/Toast')
vi.mock('@shared/hooks/useStoreAddressSearch/useStoreAddressSearch', () => ({
  useStoreAddressSearch: vi.fn(() => ({
    suggestions: [],
    isSearching: false,
    resolveSelectedAddress: vi.fn(),
    isResolvingSelectedAddress: false,
  })),
}))

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAddressesFacade).mockReturnValue({
    saveAddress: vi.fn(),
    isSavingAddress: false,
    hasSaveAddressError: false,
    storeId: 'unit-1',
    storeState: 'SP',
    ...overrides,
  } as unknown as ReturnType<typeof useAddressesFacade>)

const typeField = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

const fillRequiredAddress = () => {
  typeField('Rua', 'Rua das Flores')
  typeField('Nº', '123')
  typeField('Bairro', 'Centro')
  typeField('Cidade', 'São Paulo')
  typeField('UF', 'sp')
  fireEvent.change(screen.getByPlaceholderText('00000-000'), {
    target: { value: '01001000' },
  })
}

describe('AddressForm', () => {
  it('keeps the submit button disabled until the address is complete', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)

    // Assert
    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeDisabled()
  })

  it('does not submit an incomplete address', () => {
    const saveAddress = vi.fn()
    facadeWith({ saveAddress })

    const { container } = render(
      <AddressForm onCancel={vi.fn()} onDone={vi.fn()} />
    )
    const form = container.querySelector('form')
    if (!form) throw new Error('Address form was not rendered')
    fireEvent.submit(form)

    expect(saveAddress).not.toHaveBeenCalled()
  })

  it('shows save feedback from the facade', () => {
    facadeWith({
      hasSaveAddressError: true,
      isSavingAddress: true,
    })

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)

    expect(
      screen.getByText(
        'Não deu para salvar este endereço. Confira os campos e tente de novo.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
  })

  it('submits once every required field is filled in', async () => {
    // Arrange
    const saveAddress = vi.fn()
    facadeWith({ saveAddress })

    // Act
    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fillRequiredAddress()
    const submit = screen.getByRole('button', { name: 'Salvar endereço' })
    await waitFor(() => expect(submit).toBeEnabled())
    fireEvent.click(submit)

    // Assert
    await waitFor(() =>
      expect(saveAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          id: undefined,
          data: expect.objectContaining({
            zipCode: '01001-000',
            number: '123',
            street: 'Rua das Flores',
          }),
        }),
        expect.any(Object)
      )
    )
  })

  it('finishes creation and reports success after the save resolves', async () => {
    const onDone = vi.fn()
    const saveAddress = vi.fn(
      (_input: unknown, options: { onSuccess: () => void }) =>
        options.onSuccess()
    )
    facadeWith({ saveAddress })

    render(<AddressForm onCancel={vi.fn()} onDone={onDone} />)
    fillRequiredAddress()
    const submit = screen.getByRole('button', { name: 'Salvar endereço' })
    await waitFor(() => expect(submit).toBeEnabled())
    fireEvent.click(submit)

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce())
    expect(toast.success).toHaveBeenCalledWith('Endereço salvo.')
  })

  it('loads and updates an existing address', async () => {
    const onDone = vi.fn()
    const saveAddress = vi.fn(
      (_input: unknown, options: { onSuccess: () => void }) =>
        options.onSuccess()
    )
    facadeWith({ saveAddress })

    render(
      <AddressForm
        address={addressFormMock.address}
        onCancel={vi.fn()}
        onDone={onDone}
      />
    )
    const submit = screen.getByRole('button', { name: 'Salvar endereço' })
    await waitFor(() => expect(submit).toBeEnabled())
    fireEvent.click(submit)

    await waitFor(() =>
      expect(saveAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          id: addressFormMock.address.id,
          data: expect.objectContaining({ complement: 'Apto 12' }),
        }),
        expect.any(Object)
      )
    )
    expect(onDone).toHaveBeenCalledOnce()
    expect(toast.success).toHaveBeenCalledWith('Endereço atualizado.')
  })

  it('uppercases the state field', () => {
    facadeWith({})

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('UF'), { target: { value: 'pa' } })

    expect(screen.getByDisplayValue('PA')).toBeInTheDocument()
  })

  it('shows the cancel button firing onCancel', () => {
    // Arrange
    facadeWith({})
    const onCancel = vi.fn()

    // Act
    render(<AddressForm onCancel={onCancel} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
