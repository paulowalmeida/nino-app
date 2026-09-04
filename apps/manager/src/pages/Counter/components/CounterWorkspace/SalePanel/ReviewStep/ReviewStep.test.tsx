import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { reviewStepMock } from './ReviewStep.mock'
import { ReviewStep } from './ReviewStep'

describe('ReviewStep', () => {
  it('shows the order line and total for confirmation', () => {
    render(<ReviewStep {...reviewStepMock} />)

    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.getByText(/Total de/)).toBeInTheDocument()
  })
})
