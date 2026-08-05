import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SignupAccount } from '@custom_types/auth/signup-account'
import { RegisterWizard } from '@compositions/RegisterWizard/RegisterWizard'

const ACCOUNT: SignupAccount = {
  name: 'Weskley Almeida',
  email: 'weskley@nino.delivery',
  password: 'segredo123',
  cpf: '39053344705',
  phone: '11999998888',
}

/* Steps are replaced with buttons: what's under test here is the wizard's
 * state machine — who advances, who goes back and what survives between
 * them — not the forms, which have their own network and validation. */
const accountSpy = vi.hoisted(() => vi.fn())
const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({ useNavigate: () => navigate }))

vi.mock('@compositions/RegisterWizard/AccountStep/AccountStep', () => ({
  AccountStep: ({
    defaultValues,
    onNext,
  }: {
    defaultValues: SignupAccount | null
    onNext: (data: SignupAccount) => void
  }) => {
    accountSpy(defaultValues)
    return (
      <button type="button" onClick={() => onNext(ACCOUNT)}>
        avançar conta
      </button>
    )
  },
}))

vi.mock('@compositions/RegisterWizard/CompanyStep/CompanyStep', () => ({
  CompanyStep: ({
    account,
    onBack,
    onSignedUp,
  }: {
    account: SignupAccount
    onBack: () => void
    onSignedUp: () => void
  }) => (
    <>
      <p>empresa de {account.name}</p>
      <button type="button" onClick={onBack}>
        voltar
      </button>
      <button type="button" onClick={onSignedUp}>
        criar conta
      </button>
    </>
  ),
}))

const stepMarkers = () =>
  screen
    .getAllByRole('listitem')
    .map((item) => item.querySelector('button')?.getAttribute('aria-current'))

describe(RegisterWizard.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens on the account step', async () => {
    // Arrange / Act
    render(<RegisterWizard />)

    // Assert
    expect(screen.getByText('avançar conta')).toBeInTheDocument()
    expect(stepMarkers()).toEqual(['step', null])
  })

  it('moves to the company step carrying the account along', async () => {
    // Arrange
    render(<RegisterWizard />)

    // Act
    await userEvent.click(screen.getByText('avançar conta'))

    // Assert
    expect(screen.getByText(`empresa de ${ACCOUNT.name}`)).toBeInTheDocument()
    expect(stepMarkers()).toEqual([null, 'step'])
  })

  it('gives the typed account back when the person goes back', async () => {
    // Arrange
    render(<RegisterWizard />)

    // Act
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(screen.getByText('voltar'))

    // Assert
    expect(accountSpy).toHaveBeenLastCalledWith(ACCOUNT)
  })

  it('leaves for the panel once the account and company are created', async () => {
    // Arrange
    render(<RegisterWizard />)

    // Act
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(screen.getByText('criar conta'))

    // Assert
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('walks back to the account step from the stepper marker', async () => {
    // Arrange
    render(<RegisterWizard />)

    // Act
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(
      screen.getAllByRole('listitem')[0].querySelector('button')!
    )

    // Assert
    expect(screen.getByText('avançar conta')).toBeInTheDocument()
    expect(accountSpy).toHaveBeenLastCalledWith(ACCOUNT)
  })
})
