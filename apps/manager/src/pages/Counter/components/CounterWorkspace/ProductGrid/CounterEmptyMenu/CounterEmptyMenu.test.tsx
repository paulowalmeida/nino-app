import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { COUNTER_CAPABILITIES } from '@pages/Counter/constants/counter.constants'

import { CounterEmptyMenu } from './CounterEmptyMenu'

describe(CounterEmptyMenu.name, () => {
  it('explains the empty menu and links to product registration', () => {
    render(
      <MemoryRouter>
        <CounterEmptyMenu />
      </MemoryRouter>
    )
    expect(
      screen.getByText('O balcão está pronto, falta o cardápio')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Cadastrar primeiro produto' })
    ).toBeInTheDocument()
  })

  it('lists everything the counter can do', () => {
    render(
      <MemoryRouter>
        <CounterEmptyMenu />
      </MemoryRouter>
    )
    COUNTER_CAPABILITIES.forEach(({ title }) =>
      expect(screen.getByText(title)).toBeInTheDocument()
    )
  })
})
