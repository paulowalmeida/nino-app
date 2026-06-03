import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Drawer } from './Drawer'

describe(Drawer.displayName!, () => {
  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onOpenChange={vi.fn()} title='Painel'>
        <p>Conteúdo</p>
      </Drawer>
    )
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title='Painel'>
        <p>Conteúdo</p>
      </Drawer>
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders title and description', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title='Meu painel' description='Subtítulo'>
        <p>x</p>
      </Drawer>
    )
    expect(screen.getByText('Meu painel')).toBeInTheDocument()
    expect(screen.getByText('Subtítulo')).toBeInTheDocument()
  })

  it('calls onOpenChange when close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title='Painel'>
        <p>x</p>
      </Drawer>
    )
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
