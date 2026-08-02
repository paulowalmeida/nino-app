import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SignupAccount } from '@custom_types/auth'

import { RegisterWizard } from './RegisterWizard'

const ACCOUNT: SignupAccount = {
  name: 'Weskley Almeida',
  email: 'weskley@nino.delivery',
  password: 'segredo123',
  cpf: '39053344705',
  phone: '11999998888',
}

/* Os passos são substituídos por botões: o que se testa aqui é a máquina de
 * estados do wizard — quem avança, quem volta e o que sobrevive entre eles —
 * não os formulários, que têm rede e validação próprias. */
const accountSpy = vi.hoisted(() => vi.fn())
const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({ useNavigate: () => navigate }))

vi.mock('./AccountStep', () => ({
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

vi.mock('./CompanyStep', () => ({
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
    render(<RegisterWizard />)

    expect(screen.getByText('avançar conta')).toBeInTheDocument()
    expect(stepMarkers()).toEqual(['step', null])
  })

  it('moves to the company step carrying the account along', async () => {
    render(<RegisterWizard />)
    await userEvent.click(screen.getByText('avançar conta'))

    expect(screen.getByText(`empresa de ${ACCOUNT.name}`)).toBeInTheDocument()
    expect(stepMarkers()).toEqual([null, 'step'])
  })

  it('gives the typed account back when the person goes back', async () => {
    render(<RegisterWizard />)
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(screen.getByText('voltar'))

    expect(accountSpy).toHaveBeenLastCalledWith(ACCOUNT)
  })

  it('leaves for the panel once the account and company are created', async () => {
    render(<RegisterWizard />)
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(screen.getByText('criar conta'))

    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('walks back to the account step from the stepper marker', async () => {
    render(<RegisterWizard />)
    await userEvent.click(screen.getByText('avançar conta'))
    await userEvent.click(
      screen.getAllByRole('listitem')[0].querySelector('button')!
    )

    expect(screen.getByText('avançar conta')).toBeInTheDocument()
    expect(accountSpy).toHaveBeenLastCalledWith(ACCOUNT)
  })
})
