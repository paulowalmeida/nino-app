import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Dialog } from './Dialog'

const defaultProps = {
  title: 'Confirmar ação',
  description: 'Tem certeza?',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe(Dialog.name, () => {
  it('does not render content when closed', () => {
    render(<Dialog {...defaultProps} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders title and description when open', () => {
    render(<Dialog open {...defaultProps} />)
    expect(screen.getByText('Confirmar ação')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('calls onConfirm on confirm click', async () => {
    const onConfirm = vi.fn()
    render(<Dialog open {...defaultProps} onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel on cancel click', async () => {
    const onCancel = vi.fn()
    render(<Dialog open {...defaultProps} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows loading on confirm button when loading=true', () => {
    render(<Dialog open loading {...defaultProps} />)
    const allButtons = screen.getAllByRole('button')
    const confirmBtn = allButtons.find((b) => b.getAttribute('aria-busy') === 'true')
    expect(confirmBtn).toBeDisabled()
  })

  it('disables cancel button when loading=true', () => {
    render(<Dialog open loading {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })

  it('uses custom labels', () => {
    render(
      <Dialog
        open
        {...defaultProps}
        confirmLabel="Excluir"
        cancelLabel="Manter"
      />
    )
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Manter' })).toBeInTheDocument()
  })

})
