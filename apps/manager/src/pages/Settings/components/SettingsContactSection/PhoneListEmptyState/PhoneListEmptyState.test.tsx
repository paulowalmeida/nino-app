import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PhoneListEmptyState } from './PhoneListEmptyState'
import { phoneListEmptyStateMock } from './PhoneListEmptyState.mock'

describe(PhoneListEmptyState.name, () => {
  it('shows only the guidance needed to add a phone', () => {
    render(<PhoneListEmptyState />)

    expect(screen.getByText(phoneListEmptyStateMock.title)).toBeInTheDocument()
    expect(
      screen.getByText(/Adicione um número para que os clientes saibam/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText('O que dá para fazer aqui')
    ).not.toBeInTheDocument()
  })
})
