import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

import { TenantStep } from './TenantStep'
import { tenantStepMock } from './TenantStep.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const accountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

const companyMock: SignupCompany = {
  name: 'Padoca do Bairro',
  cnpj: '12345678000199',
}

const goToCompanyStep = vi.fn()
const mutateAsync = vi.fn()

const mockFacade = () =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    account: accountMock,
    company: companyMock,
    goToCompanyStep,
    signup: { mutateAsync },
  } as unknown as ReturnType<typeof useRegisterFacade>)

const renderStep = () =>
  render(
    <MemoryRouter>
      <TenantStep />
    </MemoryRouter>
  )

const fillAddress = async () => {
  renderStep()
  const user = userEvent.setup()
  await user.clear(screen.getByLabelText('Nome da unidade'))
  await user.type(screen.getByLabelText('Nome da unidade'), 'Padoca Centro')
  await user.type(screen.getByLabelText('Endereço público'), 'padoca-centro')
  await user.type(screen.getByLabelText('CEP'), '66000000')
  await user.type(screen.getByLabelText('Número'), '42')
  await user.type(screen.getByLabelText('Rua'), 'Rua Central')
  await user.type(screen.getByLabelText('Bairro'), 'Centro')
  await user.type(screen.getByLabelText('Cidade'), 'Belem')
  await user.type(screen.getByLabelText('UF'), 'PA')
  return user
}

describe('TenantStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade()
  })

  it('renders the unit address step through the register facade', () => {
    renderStep()

    expect(
      screen.getByRole('heading', { name: tenantStepMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome da unidade')).toHaveValue(
      companyMock.name
    )
    expect(screen.getByText('.dev.nino.delivery')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
  })

  it('returns to the company step', async () => {
    renderStep()

    await userEvent.click(
      screen.getByRole('button', { name: tenantStepMock.backLabel })
    )

    expect(goToCompanyStep).toHaveBeenCalled()
  })

  it('generates a public slug from the unit name when it is empty', async () => {
    renderStep()
    const name = screen.getByLabelText('Nome da unidade')
    const slug = screen.getByLabelText('Endereço público')

    await userEvent.clear(name)
    await userEvent.type(name, 'Padoca Centro')
    await userEvent.tab()

    expect(slug).toHaveValue('padoca-centro')
  })

  it('keeps an explicitly entered slug when the name loses focus', async () => {
    renderStep()
    const name = screen.getByLabelText('Nome da unidade')
    const slug = screen.getByLabelText('Endereço público')

    await userEvent.type(slug, 'custom-slug')
    await userEvent.click(name)
    await userEvent.click(name)
    await userEvent.click(slug)

    expect(slug).toHaveValue('custom-slug')
  })

  it('renders nothing when the registration context is incomplete', () => {
    vi.mocked(useRegisterFacade).mockReturnValue({
      account: null,
      company: null,
      goToCompanyStep,
      signup: { mutateAsync },
    } as unknown as ReturnType<typeof useRegisterFacade>)

    const { container } = renderStep()

    expect(container).toBeEmptyDOMElement()
  })

  it('submits the account and unit data', async () => {
    mutateAsync.mockResolvedValueOnce(undefined)
    const user = await fillAddress()

    await user.click(
      screen.getByRole('button', { name: 'Criar conta e unidade' })
    )

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ account: accountMock, company: companyMock })
    )
  })

  it('shows an error when account creation fails', async () => {
    mutateAsync.mockRejectedValueOnce(new Error('failed'))
    const user = await fillAddress()

    await user.click(
      screen.getByRole('button', { name: 'Criar conta e unidade' })
    )

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
