import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useGuestAddressSearch } from '@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch'

import { DeliveryAddressFields } from './DeliveryAddressFields'
import {
  addressPredictionMock,
  addressSearchResultMock,
  deliveryAddressFieldsMock,
} from './DeliveryAddressFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch')

/** WHY: o formulário real vem de `react-hook-form`, e o fluxo de endereço
 * depende de `useWatch`/`form.setValue` refletindo o valor digitado — um
 * `control`/`form` de mentira não reproduziria essa amarração. */
const Harness = ({
  zone,
}: {
  zone?: { name: string; fee: number }
} = {}) => {
  const form = useForm<CheckoutFormValues>({
    defaultValues: { guestStreet: '', guestNumber: '' },
  })
  vi.mocked(useCheckoutFacade).mockReturnValue({
    form,
    control: form.control,
    register: form.register,
    errors: form.formState.errors,
    zone,
    isQuoting: false,
    isAuthenticated: false,
    addresses: [],
    store: { id: 'store-1', state: 'PA' },
  } as unknown as CheckoutFacade)

  return <DeliveryAddressFields />
}

describe('DeliveryAddressFields', () => {
  const setup = (
    searchOverrides: Partial<ReturnType<typeof useGuestAddressSearch>> = {}
  ) => {
    vi.mocked(useGuestAddressSearch).mockReturnValue({
      suggestions: [],
      isSearching: false,
      resolveSelectedAddress: vi.fn(),
      isResolvingSelectedAddress: false,
      ...searchOverrides,
    })
  }

  it('asks for street and number, with no CEP-driven lookup', () => {
    setup()

    render(<Harness />)

    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
    expect(screen.getByLabelText('Número')).toBeInTheDocument()
    expect(screen.queryByText(/Buscando endereço pelo CEP/)).toBeNull()
  })

  it('shows the quoted delivery fee once the zone resolves', () => {
    setup()

    render(
      <Harness
        zone={{
          name: deliveryAddressFieldsMock.zoneName,
          fee: deliveryAddressFieldsMock.zoneFee,
        }}
      />
    )

    expect(screen.getByText(/Taxa de entrega/)).toBeInTheDocument()
  })

  it('opens the confirmation screen once street and number are filled', async () => {
    // Arrange: no suggestions yet, waiting for the guest to fill both fields.
    setup()
    render(<Harness />)

    // Act: type the street and number, then blur to trigger the lookup —
    // the exact behavior of the counter's DeliveryRecipientFields.
    fireEvent.change(screen.getByLabelText('Endereço'), {
      target: { value: 'Rua das Flores' },
    })
    fireEvent.blur(screen.getByLabelText('Endereço'))
    fireEvent.change(screen.getByLabelText('Número'), {
      target: { value: '123' },
    })
    fireEvent.blur(screen.getByLabelText('Número'))

    // Assert: the field view is replaced by the confirmation screen.
    await waitFor(() =>
      expect(screen.getByText('Confirme o endereço')).toBeInTheDocument()
    )
    expect(screen.queryByLabelText('Bairro')).toBeNull()
  })

  it('shows a skeleton while searching and the predictions once they arrive', async () => {
    setup({ isSearching: true })
    const { rerender } = render(<Harness />)

    fireEvent.change(screen.getByLabelText('Endereço'), {
      target: { value: 'Rua das Flores' },
    })
    fireEvent.change(screen.getByLabelText('Número'), {
      target: { value: '123' },
    })
    fireEvent.blur(screen.getByLabelText('Número'))

    await waitFor(() =>
      expect(screen.getByText('Confirme o endereço')).toBeInTheDocument()
    )
    expect(screen.getByText(/Procurando/)).toBeInTheDocument()

    // Act: the search resolves with one prediction.
    setup({ suggestions: [addressPredictionMock], isSearching: false })
    rerender(<Harness />)

    // Assert: the prediction now shows in place of the skeleton.
    expect(screen.getByText(addressPredictionMock.mainText)).toBeInTheDocument()
  })

  it('resolves the full address once a prediction is selected', async () => {
    const resolveSelectedAddress = vi
      .fn()
      .mockResolvedValue(addressSearchResultMock)
    setup({
      suggestions: [addressPredictionMock],
      resolveSelectedAddress,
    })
    render(<Harness />)

    fireEvent.change(screen.getByLabelText('Endereço'), {
      target: { value: 'Rua das Flores' },
    })
    fireEvent.change(screen.getByLabelText('Número'), {
      target: { value: '123' },
    })
    fireEvent.blur(screen.getByLabelText('Número'))
    await waitFor(() =>
      expect(
        screen.getByText(addressPredictionMock.mainText)
      ).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Assert: the details call resolved and the fields view returns, filled.
    await waitFor(() =>
      expect(resolveSelectedAddress).toHaveBeenCalledWith('place-1')
    )
    await waitFor(() =>
      expect(screen.getByLabelText('CEP')).toHaveValue(
        addressSearchResultMock.zipCode
      )
    )
  })

  it('shows an error and returns to the fields when the store does not deliver there', async () => {
    const resolveSelectedAddress = vi.fn().mockRejectedValue(new Error('nope'))
    setup({
      suggestions: [addressPredictionMock],
      resolveSelectedAddress,
    })
    render(<Harness />)

    fireEvent.change(screen.getByLabelText('Endereço'), {
      target: { value: 'Rua das Flores' },
    })
    fireEvent.change(screen.getByLabelText('Número'), {
      target: { value: '123' },
    })
    fireEvent.blur(screen.getByLabelText('Número'))
    await waitFor(() =>
      expect(
        screen.getByText(addressPredictionMock.mainText)
      ).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    await waitFor(() =>
      expect(
        screen.getByText('A loja não entrega nesse endereço.')
      ).toBeInTheDocument()
    )
  })

  it('lets the guest go back to editing without picking a prediction', async () => {
    setup({ suggestions: [addressPredictionMock] })
    render(<Harness />)

    fireEvent.change(screen.getByLabelText('Endereço'), {
      target: { value: 'Rua das Flores' },
    })
    fireEvent.change(screen.getByLabelText('Número'), {
      target: { value: '123' },
    })
    fireEvent.blur(screen.getByLabelText('Número'))
    await waitFor(() =>
      expect(screen.getByText('Confirme o endereço')).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText('Confirme o endereço'))

    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
    expect(screen.queryByText('Confirme o endereço')).toBeNull()
  })
})
