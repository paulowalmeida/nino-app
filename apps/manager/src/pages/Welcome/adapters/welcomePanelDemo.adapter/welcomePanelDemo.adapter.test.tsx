import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { welcomePanelDemo } from './welcomePanelDemo.adapter'
import { welcomePanelDemoMock } from './welcomePanelDemo.adapter.mock'

describe('welcomePanelDemo', () => {
  it('demonstrates the order ticket, including its advance action', async () => {
    const { container } = render(
      <MemoryRouter>{welcomePanelDemo(welcomePanelDemoMock.orderTicketKey)}</MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    )

    expect(container).not.toBeEmptyDOMElement()
  })

  it('demonstrates the kitchen card', () => {
    const { container } = render(
      <MemoryRouter>{welcomePanelDemo(welcomePanelDemoMock.kitchenCardKey)}</MemoryRouter>
    )

    expect(container).not.toBeEmptyDOMElement()
  })

  it('demonstrates the order timeline', () => {
    const { container } = render(
      <MemoryRouter>{welcomePanelDemo(welcomePanelDemoMock.orderTimelineKey)}</MemoryRouter>
    )

    expect(container).not.toBeEmptyDOMElement()
  })
})
