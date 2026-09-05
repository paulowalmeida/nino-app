import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ReviewStep } from './ReviewStep'
import { reviewStepMock } from './ReviewStep.mock'

describe('ReviewStep', () => {
  it('shows the order line without the redundant confirmation', () => {
    render(<ReviewStep {...reviewStepMock} />)

    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.queryByText(/Confirme com o cliente/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Total de/)).not.toBeInTheDocument()
  })
})
