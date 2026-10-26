import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartTooltip } from './ChartTooltip'
import { chartTooltipMock } from './ChartTooltip.mock'

describe(ChartTooltip.name, () => {
  it('renders the formatted date and metric value', () => {
    render(<ChartTooltip {...chartTooltipMock} />)
    expect(screen.getByText(chartTooltipMock.value)).toBeInTheDocument()
    expect(screen.getByText(/15\/09/)).toBeInTheDocument()
  })
})
