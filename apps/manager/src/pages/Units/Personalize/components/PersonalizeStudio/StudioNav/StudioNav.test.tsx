import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StudioNav } from './StudioNav'
import { studioNavGroupsMock } from './StudioNav.mock'

const onSelect = vi.fn()

describe(StudioNav.name, () => {
  beforeEach(() => onSelect.mockClear())

  it('lists the parts of the store in order', () => {
    render(
      <StudioNav
        groups={studioNavGroupsMock}
        selected="colors"
        onSelect={onSelect}
      />
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Cores')

    await userEvent.click(screen.getByRole('combobox'))

    expect(
      screen.getAllByRole('option').map((option) => option.textContent)
    ).toEqual(['Cores', 'Acompanhamento'])
  })

  it('marks which part is open', () => {
    render(
      <StudioNav
        groups={studioNavGroupsMock}
        selected="tracking"
        onSelect={onSelect}
      />
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Acompanhamento')
  })

  it('asks for another part when one is chosen', async () => {
    render(
      <StudioNav
        groups={studioNavGroupsMock}
        selected="colors"
        onSelect={onSelect}
      />
    )

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(
      screen.getByRole('option', { name: 'Acompanhamento' })
    )

    expect(onSelect).toHaveBeenCalledWith('tracking')
  })
})
