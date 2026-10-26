import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import type { AddressLookup } from '@nino/lib/types/address/address-lookup'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressForm } from './AddressForm'
import { addressFormMock } from './AddressForm.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')
vi.mock('@nino/ds/components/Toast')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAddressesFacade).mockReturnValue({
    saveAddress: vi.fn(),
    isSavingAddress: false,
    hasSaveAddressError: false,
    lookupAddress: vi.fn(),
    isLookingUpAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAddressesFacade>)

const lookupWith = (address: AddressLookup | null) =>
  vi.fn(
    (
      _zipCode: string,
      options: { onSuccess: (found: AddressLookup | null) => void }
    ) => options.onSuccess(address)
  )

const fillRequiredAddress = async () => {
  fireEvent.change(screen.getByPlaceholderText('00000-000'), {
    target: { value: '01001000' },
  })
  await waitFor(() =>
    expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
  )
  fireEvent.change(screen.getByLabelText('Nº'), {
    target: { value: '123' },
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

  it('fills the address fields once the zip code lookup resolves', async () => {
    // Arrange
    facadeWith({ lookupAddress: lookupWith(addressFormMock.lookup) })

    // Act
    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001000' },
    })

    // Assert
    await waitFor(() =>
      expect(screen.getByDisplayValue('Rua das Flores')).toBeInTheDocument()
    )
    expect(screen.getByDisplayValue('Centro')).toBeInTheDocument()
    expect(screen.getByLabelText('Nº')).toHaveFocus()
  })

  it('warns when the zip code is not found', async () => {
    // Arrange
    facadeWith({ lookupAddress: lookupWith(null) })

    // Act
    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
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

  it('does not look up an incomplete zip code', () => {
    const lookupAddress = vi.fn()
    facadeWith({ lookupAddress })

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001' },
    })

    expect(lookupAddress).not.toHaveBeenCalled()
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

  it('warns when the zip code lookup fails', async () => {
    const lookupAddress = vi.fn(
      (_zipCode: string, options: { onError: () => void }) => options.onError()
    )
    facadeWith({ lookupAddress })

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001000' },
    })

    expect(
      await screen.findByText(
        'Não achamos esse CEP. Preencha o endereço abaixo.'
      )
    ).toBeInTheDocument()
  })

  it('shows lookup and save feedback from the facade', () => {
    facadeWith({
      isLookingUpAddress: true,
      hasSaveAddressError: true,
      isSavingAddress: true,
    })

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)

    expect(screen.getByText('Buscando endereço…')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Não deu para salvar este endereço. Confira os campos e tente de novo.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
  })

  it('keeps typed fields when the zip code service returns them empty', async () => {
    facadeWith({
      lookupAddress: lookupWith({
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      }),
    })

    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Rua'), {
      target: { value: 'Rua informada' },
    })
    fireEvent.change(screen.getByLabelText('Bairro'), {
      target: { value: 'Bairro informado' },
    })
    fireEvent.change(screen.getByLabelText('Cidade'), {
      target: { value: 'Cidade informada' },
    })
    fireEvent.change(screen.getByLabelText('UF'), {
      target: { value: 'pa' },
    })
    fireEvent.change(screen.getByPlaceholderText('00000-000'), {
      target: { value: '01001000' },
    })

    expect(await screen.findByDisplayValue('Rua informada')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Bairro informado')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cidade informada')).toBeInTheDocument()
    expect(screen.getByDisplayValue('PA')).toBeInTheDocument()
  })

  it.each(['Rua', 'Nº', 'Bairro', 'Cidade', 'UF'])(
    'blocks saving when %s is blank',
    (label) => {
      facadeWith({})

      render(
        <AddressForm
          address={addressFormMock.address}
          onCancel={vi.fn()}
          onDone={vi.fn()}
        />
      )
      fireEvent.change(screen.getByLabelText(label), { target: { value: '' } })

      expect(
        screen.getByRole('button', { name: 'Salvar endereço' })
      ).toBeDisabled()
    }
  )

  it('submits once every required field is filled in', async () => {
    // Arrange
    const saveAddress = vi.fn()
    facadeWith({
      saveAddress,
      lookupAddress: lookupWith(addressFormMock.lookup),
    })

    // Act
    render(<AddressForm onCancel={vi.fn()} onDone={vi.fn()} />)
    await fillRequiredAddress()
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
    facadeWith({
      saveAddress,
      lookupAddress: lookupWith(addressFormMock.lookup),
    })

    render(<AddressForm onCancel={vi.fn()} onDone={onDone} />)
    await fillRequiredAddress()
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
