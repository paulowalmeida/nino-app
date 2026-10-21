import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerRow } from './ConsumerRow'
import { consumerRowMock } from './ConsumerRow.mock'

describe('ConsumerRow', () => {
  it('links the name to the consumer file and shows the row stats', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <ConsumerRow consumer={consumerRowMock} index={0} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const row = screen.getByRole('row')
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/${consumerRowMock.id}`)
    expect(link).toHaveTextContent(consumerRowMock.name)
    expect(row).toHaveTextContent(consumerRowMock.phoneLabel)
    expect(row).toHaveTextContent('R$ 890,50')
    expect(row).toHaveTextContent('12 pedidos')
    expect(row).toHaveTextContent(consumerRowMock.sinceLabel)
  })

  it('opens the consumer file from the avatar as well as the name', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <ConsumerRow consumer={consumerRowMock} index={0} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link').querySelector('[aria-hidden="true"]')
    ).toBeInTheDocument()
  })
})
