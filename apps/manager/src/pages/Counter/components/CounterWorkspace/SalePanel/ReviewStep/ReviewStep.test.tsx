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

  it('keeps the preparation choice and additional in separate lines', () => {
    render(
      <ReviewStep
        {...reviewStepMock}
        lines={[
          {
            productId: 'p1',
            name: 'X-Bacon',
            quantity: 1,
            unitPrice: '32.4',
            modifiers: [
              {
                optionId: 'point',
                name: 'Ao ponto',
                unitPrice: '0',
                quantity: 1,
                groupName: 'Ponto da carne',
              },
              {
                optionId: 'egg',
                name: 'Ovo',
                unitPrice: '2.5',
                quantity: 1,
                groupName: 'Adicionais',
              },
            ],
          },
        ]}
      />
    )

    expect(screen.getByText('Ponto da carne: Ao ponto')).toBeInTheDocument()
    expect(screen.getByText('Adicionais: Ovo')).toBeInTheDocument()
  })
})
