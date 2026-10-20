import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PositionDetailSummary } from './PositionDetailSummary'
import { positionDetailSummaryMock } from './PositionDetailSummary.mock'

describe(PositionDetailSummary.name, () => {
  it('omits the placement for the cargo at the top', () => {
    render(
      <PositionDetailSummary {...positionDetailSummaryMock} aboveName={null} />
    )

    expect(screen.queryByText('fica logo abaixo de')).not.toBeInTheDocument()
    expect(screen.getByText('3 de 22')).toBeInTheDocument()
  })

  it('summarises position, permissions and people', () => {
    render(<PositionDetailSummary {...positionDetailSummaryMock} />)

    expect(
      screen.getByRole('complementary', { name: 'Resumo do cargo' })
    ).toBeInTheDocument()
    expect(screen.getByText('Gerente')).toBeInTheDocument()
    expect(screen.getByText('3 de 22')).toBeInTheDocument()
    expect(screen.getByText('2 pessoas')).toBeInTheDocument()
  })

  it('uses the singular for a single person', () => {
    render(
      <PositionDetailSummary {...positionDetailSummaryMock} memberCount={1} />
    )

    expect(screen.getByText('1 pessoa')).toBeInTheDocument()
  })
})
