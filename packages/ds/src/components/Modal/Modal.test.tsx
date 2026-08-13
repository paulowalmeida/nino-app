import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button/Button'
import { Modal } from './Modal'

describe(Modal.name, () => {
  it('does not render content when closed', () => {
    render(<Modal header={<span>Título</span>} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(
      <Modal open header={<span>Título</span>} body={<span>Corpo</span>} />
    )
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Corpo')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Modal open footer={<Button>Confirmar</Button>} />)
    expect(
      screen.getByRole('button', { name: 'Confirmar' })
    ).toBeInTheDocument()
  })

  it('does not render header when not provided', () => {
    render(<Modal open body={<span>Corpo</span>} />)
    expect(screen.getByText('Corpo')).toBeInTheDocument()
  })

  it('closes when the close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} header={<span>Título</span>} />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('takes its accessible name from the header', () => {
    // Arrange / Act
    render(<Modal open header={<span>Excluir item</span>} />)

    // Assert
    expect(
      screen.getByRole('dialog', { name: 'Excluir item' })
    ).toBeInTheDocument()
  })

  it('lets ariaLabel win over the header', () => {
    // Arrange / Act
    render(
      <Modal open ariaLabel="Prévia do produto" header={<span>Burguer</span>} />
    )

    // Assert
    expect(
      screen.getByRole('dialog', { name: 'Prévia do produto' })
    ).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size %s without errors',
    (size) => {
      render(<Modal open size={size} body={<span>Corpo</span>} />)
      expect(screen.getByText('Corpo')).toBeInTheDocument()
    }
  )
})
