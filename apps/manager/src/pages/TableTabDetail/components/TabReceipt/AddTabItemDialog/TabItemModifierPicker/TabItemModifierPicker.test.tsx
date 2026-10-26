import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TabItemModifierPicker } from './TabItemModifierPicker'
import { tabItemModifierPickerMock } from './TabItemModifierPicker.mock'

const [singleChoice, multipleChoice] = tabItemModifierPickerMock.modifiers

const renderPicker = (selection = {}) => {
  const onToggle = vi.fn()
  render(
    <TabItemModifierPicker
      modifiers={tabItemModifierPickerMock.modifiers}
      selection={selection}
      onToggle={onToggle}
    />
  )
  return onToggle
}

describe('TabItemModifierPicker', () => {
  it('states what each group asks for', () => {
    renderPicker()

    expect(screen.getByText('Escolha ao menos 1')).toBeInTheDocument()
    expect(screen.getByText('Opcional, até 2')).toBeInTheDocument()
  })

  it('shows the price of paid options only', () => {
    renderPicker()

    expect(screen.getByText('+ R$ 2,00')).toBeInTheDocument()
    expect(screen.getByText('+ R$ 3,00')).toBeInTheDocument()
    expect(screen.getAllByText(/^\+ R\$/)).toHaveLength(3)
  })

  it('picks the option of a single-choice group', async () => {
    const onToggle = renderPicker()

    await userEvent.click(screen.getByLabelText('Bem passado'))

    expect(onToggle).toHaveBeenCalledWith(singleChoice, 'option-2', true)
  })

  it('toggles the options of a multiple-choice group', async () => {
    const onToggle = renderPicker({ 'modifier-2': ['option-3'] })

    await userEvent.click(screen.getByRole('checkbox', { name: /Bacon/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Queijo/ }))

    expect(onToggle).toHaveBeenNthCalledWith(
      1,
      multipleChoice,
      'option-3',
      false
    )
    expect(onToggle).toHaveBeenNthCalledWith(
      2,
      multipleChoice,
      'option-4',
      true
    )
  })

  it('blocks further options once the group is at its limit', () => {
    renderPicker({ 'modifier-2': ['option-3', 'option-4'] })

    expect(screen.getByRole('checkbox', { name: /Ovo/ })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: /Bacon/ })).toBeEnabled()
  })
})
