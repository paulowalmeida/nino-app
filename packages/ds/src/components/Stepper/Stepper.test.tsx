import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Stepper } from './Stepper'

const steps = [
  { title: 'Dados pessoais', description: 'Nome e CPF' },
  { title: 'Endereço', description: 'Onde entregar' },
  { title: 'Pagamento' },
]

describe(Stepper.name, () => {
  it('renders the step titles', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByText('Dados pessoais')).toBeInTheDocument()
    expect(screen.getByText('Endereço')).toBeInTheDocument()
    expect(screen.getByText('Pagamento')).toBeInTheDocument()
  })

  it('renders descriptions when provided', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByText('Nome e CPF')).toBeInTheDocument()
  })

  it('calls onStepChange when clicking a step', async () => {
    const onStepChange = vi.fn()
    render(<Stepper steps={steps} step={0} onStepChange={onStepChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Endereço' }))
    expect(onStepChange).toHaveBeenCalledWith(1)
  })

  it('renders the correct number of steps', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getAllByRole('button')).toHaveLength(steps.length)
  })
})
