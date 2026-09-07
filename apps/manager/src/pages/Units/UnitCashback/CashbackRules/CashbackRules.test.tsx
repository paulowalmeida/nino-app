import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CashbackRules } from './CashbackRules'
import {
  cashbackRulesOffMock,
  cashbackRulesSettingsMock,
} from './CashbackRules.mock'

const onSave = vi.fn()

const renderRules = (settings = cashbackRulesSettingsMock, isPending = false) =>
  render(
    <CashbackRules
      settings={settings}
      isPending={isPending}
      isSaving={false}
      onSave={onSave}
    />
  )

describe(CashbackRules.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the rule the store has today', () => {
    renderRules()

    expect(screen.getByRole('textbox', { name: /Quanto volta/ })).toHaveValue('5')
    expect(screen.getByRole('textbox', { name: /Saldo mínimo/ })).toHaveValue(
      '10,00'
    )
  })

  it('keeps the save closed until something changes', () => {
    renderRules()

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })

  it('sends the typed rule as numbers the API understands', async () => {
    renderRules()

    const percent = screen.getByRole('textbox', { name: /Quanto volta/ })
    await userEvent.clear(percent)
    await userEvent.type(percent, '7,5')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        cashbackEnabled: true,
        cashbackPercent: 7.5,
        cashbackMinRedeem: 10,
      })
    )
  })

  it('masks the minimum as money while it is typed', async () => {
    renderRules()

    const minimum = screen.getByRole('textbox', { name: /Saldo mínimo/ })
    await userEvent.clear(minimum)
    await userEvent.type(minimum, '1240')

    expect(minimum).toHaveValue('12,40')
  })

  it('locks the numbers while the program is off', () => {
    renderRules(cashbackRulesOffMock)

    expect(screen.getByRole('textbox', { name: /Quanto volta/ })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: /Saldo mínimo/ })).toBeDisabled()
  })

  it('shows the skeleton until the rule arrives', () => {
    const { container } = renderRules(cashbackRulesSettingsMock, true)

    expect(
      screen.queryByRole('textbox', { name: /Quanto volta/ })
    ).not.toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })

  it('saves nothing while the rule has not arrived', async () => {
    render(
      <CashbackRules
        settings={undefined}
        isPending={false}
        isSaving={false}
        onSave={onSave}
      />
    )

    await userEvent.click(screen.getByLabelText('Oferecer cashback'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).not.toHaveBeenCalled()
  })

  it('reads an empty percent as zero', async () => {
    renderRules()

    await userEvent.clear(screen.getByRole('textbox', { name: /Quanto volta/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ cashbackPercent: 0 })
    )
  })

  it('turns the program off without touching the numbers', async () => {
    renderRules()

    await userEvent.click(screen.getByLabelText('Oferecer cashback'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        cashbackEnabled: false,
        cashbackPercent: 5,
        cashbackMinRedeem: 10,
      })
    )
  })
})
