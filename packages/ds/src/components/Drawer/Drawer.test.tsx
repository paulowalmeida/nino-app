import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Drawer } from './Drawer'

describe(Drawer.name, () => {
  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onOpenChange={vi.fn()} title="Painel">
        <p>Conteúdo</p>
      </Drawer>
    )
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title="Painel">
        <p>Conteúdo</p>
      </Drawer>
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders title and description', () => {
    render(
      <Drawer
        open
        onOpenChange={vi.fn()}
        title="Meu painel"
        description="Subtítulo"
      >
        <p>x</p>
      </Drawer>
    )
    expect(screen.getByText('Meu painel')).toBeInTheDocument()
    expect(screen.getByText('Subtítulo')).toBeInTheDocument()
  })

  it('calls onOpenChange when close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="Painel">
        <p>x</p>
      </Drawer>
    )
    await userEvent.click(screen.getByLabelText('Fechar'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('applies contentClassName to the content surface', () => {
    render(
      <Drawer
        open
        onOpenChange={vi.fn()}
        title="Painel"
        contentClassName="bg-surface-1"
      >
        <p>x</p>
      </Drawer>
    )
    expect(screen.getByText('Painel').closest('[role="dialog"]')).toHaveClass(
      'bg-surface-1'
    )
  })

  it('renders a drag handle only for the bottom placement', () => {
    // Arrange / Act
    const { rerender } = render(
      <Drawer open onOpenChange={vi.fn()} placement="right">
        <p>x</p>
      </Drawer>
    )

    // Assert
    const content = screen.getByText('x').closest('[role="dialog"]')!
    expect(
      content.querySelector('[aria-hidden="true"]')
    ).not.toBeInTheDocument()

    rerender(
      <Drawer open onOpenChange={vi.fn()} placement="bottom">
        <p>x</p>
      </Drawer>
    )
    expect(content.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('dismisses a bottom drawer when dragged past the threshold', () => {
    // Arrange
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    render(
      <Drawer
        open
        onOpenChange={onOpenChange}
        title="Painel"
        placement="bottom"
      >
        <p>x</p>
      </Drawer>
    )
    const content = screen.getByText('Painel').closest('[role="dialog"]')!
    const handle = content.querySelector('[aria-hidden="true"]')!

    // Act
    fireEvent.pointerDown(handle, { clientY: 0 })
    fireEvent.pointerMove(handle, { clientY: 130 })
    fireEvent.pointerUp(handle, { clientY: 130 })
    vi.runAllTimers()

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false)
    vi.useRealTimers()
  })

  it('springs back without closing on a short drag', () => {
    // Arrange
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    render(
      <Drawer
        open
        onOpenChange={onOpenChange}
        title="Painel"
        placement="bottom"
      >
        <p>x</p>
      </Drawer>
    )
    const content = screen.getByText('Painel').closest('[role="dialog"]')!
    const handle = content.querySelector('[aria-hidden="true"]')!

    // Act
    fireEvent.pointerDown(handle, { clientY: 0 })
    fireEvent.pointerMove(handle, { clientY: 20 })
    fireEvent.pointerUp(handle, { clientY: 20 })
    vi.runAllTimers()

    // Assert
    expect(onOpenChange).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
  it('keeps the width in a CSS variable when it fills the screen on mobile', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title="Painel" size="26rem" fullOnMobile>
        <p>x</p>
      </Drawer>
    )
    const content = screen.getByRole('dialog')

    expect(content.style.getPropertyValue('--drawer-size')).toBe('26rem')
    expect(content.style.width).toBe('')
  })

  it('lets the owner keep the drawer open when Escape is pressed', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer
        open
        onOpenChange={onOpenChange}
        title="Painel"
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <p>x</p>
      </Drawer>
    )

    await userEvent.keyboard('{Escape}')

    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
