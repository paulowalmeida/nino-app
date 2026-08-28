import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { tenantPhoneMock } from './PhoneList/PhoneList.mock'
import { SettingsContactSection } from './SettingsContactSection'

const contact = vi.hoisted(() => ({
  add: { mutate: vi.fn(), isPending: false },
  edit: { mutate: vi.fn() },
  drop: { mutate: vi.fn() },
}))

vi.mock('@pages/Settings/facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    contact: {
      query: { phones: [tenantPhoneMock], isPending: false },
      mutations: contact,
    },
  }),
}))

describe('SettingsContactSection', () => {
  it('composes the contact flow and confirms a removal', async () => {
    const user = userEvent.setup()

    render(<SettingsContactSection />)

    expect(screen.getByRole('heading', { name: 'Contato da loja' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Adicionar telefone' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover' }))
    expect(contact.drop.mutate).not.toHaveBeenCalled()

    const dialog = await screen.findByRole('dialog')
    await user.click(
      within(dialog).getByRole('button', { name: 'Remover telefone' })
    )

    expect(contact.drop.mutate).toHaveBeenCalledWith(tenantPhoneMock.id)
  })
})
