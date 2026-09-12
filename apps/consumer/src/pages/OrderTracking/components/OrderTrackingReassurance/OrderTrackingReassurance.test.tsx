import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTrackingReassurance } from './OrderTrackingReassurance'
import { orderTrackingReassuranceMock } from './OrderTrackingReassurance.mock'

describe('OrderTrackingReassurance', () => {
  it('reassures the consumer about WhatsApp updates', () => {
    render(<OrderTrackingReassurance />)
    expect(
      screen.getByText(new RegExp(orderTrackingReassuranceMock.message))
    ).toBeInTheDocument()
  })
})
