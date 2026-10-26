import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimingFiguresGrid } from './TimingFiguresGrid'
import { timingFiguresGridMock } from './TimingFiguresGrid.mock'

describe('TimingFiguresGrid', () => {
  it('labels both averages', () => {
    render(<TimingFiguresGrid timing={timingFiguresGridMock.sampled} />)

    expect(screen.getByText('Tempo médio de preparo')).toBeInTheDocument()
    expect(screen.getByText('Tempo médio de entrega')).toBeInTheDocument()
  })

  it('says there was no delivery instead of showing a zero average', () => {
    render(
      <TimingFiguresGrid timing={timingFiguresGridMock.withoutDeliveries} />
    )

    expect(screen.getByText('Sem entregas no período')).toBeInTheDocument()
    expect(screen.queryByText('Sem pedidos no período')).not.toBeInTheDocument()
  })
})
