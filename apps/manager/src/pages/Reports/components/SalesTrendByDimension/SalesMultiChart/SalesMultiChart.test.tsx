import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesMultiChart } from './SalesMultiChart'

describe('SalesMultiChart', () => {
  it('renders nothing for a timeline without enough points', () => {
    const { container } = render(
      <SalesMultiChart
        series={[]}
        granularity="day"
        labelOf={(key) => key}
        label="Série"
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
