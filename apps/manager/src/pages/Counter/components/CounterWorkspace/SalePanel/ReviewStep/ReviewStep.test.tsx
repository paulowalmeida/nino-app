import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { reviewStepMock } from './ReviewStep.mock'
import { ReviewStep } from './ReviewStep'

describe('ReviewStep', () => {
  it('shows the order line without the redundant confirmation', () => {
    render(<ReviewStep {...reviewStepMock} />)

    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.queryByText(/Confirme com o cliente/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Total de/)).not.toBeInTheDocument()
  })
})
