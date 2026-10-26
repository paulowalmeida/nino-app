import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'
import styles from './Button.module.css'

describe('Button', () => {
  it('renders the text correctly', () => {
    render(<Button>Confirmar</Button>)
    expect(
      screen.getByRole('button', { name: 'Confirmar' })
    ).toBeInTheDocument()
  })

  it('calls onClick on click', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Clique
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('drops the fill when a filled variant is disabled', () => {
    render(<Button disabled>Salvar</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain(styles.disabledFilled)
    expect(button.className).not.toContain(styles.variantPrimary)
  })

  it('keeps the fill while loading, since the action is running', () => {
    render(<Button loading>Salvar</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain(styles.variantPrimary)
    expect(button.className).toContain(styles.loadingDimmed)
  })

  it('fades a transparent variant instead of filling it', () => {
    render(
      <Button variant="outline" disabled>
        Salvar
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button.className).toContain(styles.disabledTransparent)
    expect(button.className).not.toContain(styles.disabledFilled)
  })

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} loading>
        Clique
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('sets aria-busy when loading', () => {
    render(<Button loading>Salvando</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('applies extra className without overriding base classes', () => {
    // Arrange / Act
    render(<Button className="mt-4">Botão</Button>)

    // Assert
    expect(screen.getByRole('button')).toHaveClass('mt-4')
    expect(screen.getByRole('button')).toHaveClass(styles.button)
  })

  it.each([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'inverse',
    'inverseOutline',
    'danger',
  ] as const)('renderiza variante %s sem erros', (variant) => {
    render(<Button variant={variant}>{variant}</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg', 'icon'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      render(
        <Button size={size} aria-label={size}>
          {size === 'icon' ? '×' : size}
        </Button>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it('renders as child element with asChild', () => {
    render(
      <Button asChild>
        <a href="/rota">Link</a>
      </Button>
    )
    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument()
  })
})
