import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartTooltip } from '@molecules/ChartTooltip/ChartTooltip'

describe(ChartTooltip.name, () => {
  it('shows the formatted date and the given value', () => {
    // Arrange / Act
    render(
      <ChartTooltip at={new Date('2026-07-01T14:30:00Z')} value="R$ 150,00" />
    )

    // Assert
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
  })
})
