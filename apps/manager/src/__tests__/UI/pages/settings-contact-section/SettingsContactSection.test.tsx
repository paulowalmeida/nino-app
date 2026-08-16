import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { usePhoneMutations } from '@hooks/settings/usePhoneMutations'
import { usePhones } from '@hooks/settings/usePhones'

import {
  SettingsContactSection,
} from '@pages/settings-contact-section/SettingsContactSection'

import { currentTenant, phones } from './SettingsContactSection.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/settings/usePhoneMutations')
vi.mock('@hooks/settings/usePhones')

describe(SettingsContactSection.name, () => {
  it('lists the tenant phones already registered', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(usePhones).mockReturnValue({
      phones,
      isPending: false,
    } as unknown as ReturnType<typeof usePhones>)
    vi.mocked(usePhoneMutations).mockReturnValue({
      add: { mutate: vi.fn(), isPending: false },
      edit: { mutate: vi.fn() },
      drop: { mutate: vi.fn() },
    } as unknown as ReturnType<typeof usePhoneMutations>)

    // Act
    render(<SettingsContactSection />)

    // Assert
    expect(screen.getByText('(85) 99999-8888')).toBeInTheDocument()
  })

  it('adds a phone through the mutation for the current tenant', async () => {
    // Arrange
    const add = { mutate: vi.fn(), isPending: false }
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(usePhones).mockReturnValue({
      phones: [],
      isPending: false,
    } as unknown as ReturnType<typeof usePhones>)
    vi.mocked(usePhoneMutations).mockReturnValue({
      add,
      edit: { mutate: vi.fn() },
      drop: { mutate: vi.fn() },
    } as unknown as ReturnType<typeof usePhoneMutations>)
    render(<SettingsContactSection />)

    // Act
    await userEvent.type(
      screen.getByPlaceholderText('(00) 00000-0000'),
      '85999998888'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar telefone' })
    )

    // Assert
    expect(add.mutate).toHaveBeenCalledWith('+5585999998888')
  })
})
