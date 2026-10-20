import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { SettingsServiceFeeTab } from './SettingsServiceFeeTab'
import { settingsServiceFeeTabMock } from './SettingsServiceFeeTab.mock'

vi.mock('@pages/Settings/facades/useSettingsFacade/useSettingsFacade')

const mockFacade = (settings: unknown, isPending = false) => {
  const mutate = vi.fn()
  vi.mocked(useSettingsFacade).mockReturnValue({
    service: { query: { data: settings, isPending } },
    serviceFee: { save: { mutate, isPending: false } },
  } as unknown as ReturnType<typeof useSettingsFacade>)
  return mutate
}

const percentField = () =>
  screen.getByRole('textbox', { name: settingsServiceFeeTabMock.percentLabel })

describe('SettingsServiceFeeTab', () => {
  beforeEach(() => vi.clearAllMocks())

  it('turns the service fee on with the usual 10% and saves the whole settings', async () => {
    const mutate = mockFacade(settingsServiceFeeTabMock.offSettings)
    render(<SettingsServiceFeeTab />)

    expect(percentField()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(mutate).toHaveBeenCalledWith({
      ...settingsServiceFeeTabMock.offSettings,
      serviceFeeEnabled: true,
      serviceFeePercent: 10,
    })
  })

  it('saves a decimal percent typed with a comma', async () => {
    const mutate = mockFacade(settingsServiceFeeTabMock.onSettings)
    render(<SettingsServiceFeeTab />)

    await userEvent.clear(percentField())
    await userEvent.type(percentField(), '12,5')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ serviceFeePercent: 12.5 })
    )
  })

  it('blocks a fee above 20%', async () => {
    const mutate = mockFacade(settingsServiceFeeTabMock.onSettings)
    render(<SettingsServiceFeeTab />)

    await userEvent.clear(percentField())
    await userEvent.type(percentField(), '30')

    expect(screen.getByText('A taxa vai até 20%.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('holds the place while the settings load', () => {
    mockFacade(undefined, true)

    render(<SettingsServiceFeeTab />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
