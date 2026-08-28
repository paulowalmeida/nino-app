import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PhoneList } from './PhoneList'
import { tenantPhoneMock } from './PhoneList.mock'

describe('PhoneList', () => {
  it('shows the empty state', () => {
    render(
      <PhoneList
        phones={[]}
        isPending={false}
        onEdit={() => undefined}
        onRemove={() => undefined}
      />
    )
    expect(
      screen.getByText(/Adicione um número para que os clientes saibam/)
    ).toBeInTheDocument()
  })

  it('shows the configured phone with its actions', () => {
    render(
      <PhoneList
        phones={[tenantPhoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onRemove={() => undefined}
      />
    )

    expect(screen.getByText('Telefones cadastrados')).toBeInTheDocument()
    expect(screen.getByText('1 telefone')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /\(91\) 99999-9999/ })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
  })

  it('requests removal for the selected phone', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()

    render(
      <PhoneList
        phones={[tenantPhoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onRemove={onRemove}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Remover' }))

    expect(onRemove).toHaveBeenCalledWith(tenantPhoneMock)
  })
})
