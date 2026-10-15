import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscriptionInterestFacade } from '../../../facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'
import { SubscriptionInterestForm } from './SubscriptionInterestForm'
import {
  expectedInterestInputMock,
  expectedWhatsappInterestInputMock,
  filledInterestMock,
  whatsappContactMock,
} from './SubscriptionInterestForm.mock'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock(
  '../../../facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'
)

const requestInterest = vi.fn()

const mockFacade = (requestState: {
  isRequestingInterest: boolean
  isRequestInterestError: boolean
}) =>
  vi.mocked(useSubscriptionInterestFacade).mockReturnValue({
    requestInterest,
    ...requestState,
  })

describe(SubscriptionInterestForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade({ isRequestingInterest: false, isRequestInterestError: false })
  })

  it('validates required context before sending', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SubscriptionInterestForm onInterestSent={vi.fn()} />)

    // Act
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    // Assert
    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(
      screen.getByText('Informe pelo menos uma unidade.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Conte o que sua operação precisa.')
    ).toBeInTheDocument()
    expect(requestInterest).not.toHaveBeenCalled()
  })

  it('sends the operation context and reports the sent request', async () => {
    // Arrange
    const user = userEvent.setup()
    const onInterestSent = vi.fn()
    requestInterest.mockImplementation(
      (_input: unknown, options: { onSuccess: () => void }) =>
        options.onSuccess()
    )
    render(<SubscriptionInterestForm onInterestSent={onInterestSent} />)

    // Act
    await user.type(screen.getByLabelText(/Nome/), filledInterestMock.contactName)
    await user.type(
      screen.getByLabelText(/E-mail/),
      filledInterestMock.contactEmail
    )
    await user.type(
      screen.getByLabelText(/Quantidade de unidades/),
      filledInterestMock.unitCount
    )
    await user.type(
      screen.getByLabelText(/O que sua operação precisa/),
      filledInterestMock.needs
    )
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    // Assert
    expect(requestInterest).toHaveBeenCalledWith(expectedInterestInputMock, {
      onSuccess: onInterestSent,
    })
    expect(onInterestSent).toHaveBeenCalledOnce()
  })

  it('asks for a phone when the contact channel needs one', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SubscriptionInterestForm onInterestSent={vi.fn()} />)

    // Act
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'WhatsApp' }))
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    // Assert
    expect(
      screen.getByText('Informe um telefone para esse canal.')
    ).toBeInTheDocument()
  })

  it('sends the phone and desired features for a WhatsApp contact', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<SubscriptionInterestForm onInterestSent={vi.fn()} />)

    // Act
    await user.type(screen.getByLabelText(/Nome/), filledInterestMock.contactName)
    await user.type(
      screen.getByLabelText(/E-mail/),
      filledInterestMock.contactEmail
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'WhatsApp' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Telefone' }),
      whatsappContactMock.phone
    )
    await user.type(
      screen.getByLabelText(/Quantidade de unidades/),
      filledInterestMock.unitCount
    )
    await user.type(
      screen.getByLabelText(/O que sua operação precisa/),
      filledInterestMock.needs
    )
    await user.type(
      screen.getByLabelText(/Recursos ou integrações importantes/),
      whatsappContactMock.desiredFeatures
    )
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    // Assert
    expect(requestInterest).toHaveBeenCalledWith(
      expectedWhatsappInterestInputMock,
      expect.anything()
    )
  })

  it('keeps the draft and warns when sending fails', () => {
    // Arrange
    mockFacade({ isRequestingInterest: false, isRequestInterestError: true })

    // Act
    render(<SubscriptionInterestForm onInterestSent={vi.fn()} />)

    // Assert
    expect(
      screen.getByText(/Não foi possível enviar a solicitação agora/)
    ).toBeInTheDocument()
  })

  it('goes back to the subscription screen', () => {
    // Arrange
    render(<SubscriptionInterestForm onInterestSent={vi.fn()} />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    // Assert
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })
})
