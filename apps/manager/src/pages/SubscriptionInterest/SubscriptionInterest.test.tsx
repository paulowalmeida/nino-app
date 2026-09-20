import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscriptionFacade } from '@pages/Subscription/facades/useSubscriptionFacade/useSubscriptionFacade'

import { SubscriptionInterest } from './SubscriptionInterest'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))
vi.mock(
  '@pages/Subscription/facades/useSubscriptionFacade/useSubscriptionFacade'
)

describe(SubscriptionInterest.name, () => {
  const requestInterest = vi.fn().mockResolvedValue({ id: 'interest-1' })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSubscriptionFacade).mockReturnValue({
      requestInterest,
      isRequestingInterest: false,
      isRequestInterestError: false,
    } as unknown as ReturnType<typeof useSubscriptionFacade>)
  })

  it('validates required context before sending', async () => {
    const user = userEvent.setup()
    render(<SubscriptionInterest />)

    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument()
    expect(requestInterest).not.toHaveBeenCalled()
  })

  it('sends the operation context and confirms the request', async () => {
    const user = userEvent.setup()
    render(<SubscriptionInterest />)

    await user.type(screen.getByLabelText(/Nome/), 'Paulo')
    await user.type(screen.getByLabelText(/E-mail/), 'paulo@nino.delivery')
    await user.type(screen.getByLabelText(/Quantidade de unidades/), '12')
    await user.type(
      screen.getByLabelText(/O que sua operação precisa/),
      'Operação com várias unidades'
    )
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    expect(requestInterest).toHaveBeenCalledWith({
      contactName: 'Paulo',
      contactEmail: 'paulo@nino.delivery',
      contactPhone: undefined,
      preferredContactMethod: 'EMAIL',
      unitCount: 12,
      needs: 'Operação com várias unidades',
      desiredFeatures: undefined,
    })
    expect(await screen.findByText('Solicitação enviada')).toBeInTheDocument()
  })
})
