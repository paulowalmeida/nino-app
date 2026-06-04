import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Popover } from './Popover'

describe(Popover.displayName!, () => {
  it('does not show content initially', () => {
    render(
      <Popover trigger={<button>Abrir</button>}>
        <span>Conteúdo do popover</span>
      </Popover>
    )
    expect(screen.queryByText('Conteúdo do popover')).not.toBeInTheDocument()
  })

  it('shows content on trigger click', async () => {
    render(
      <Popover trigger={<button>Abrir</button>}>
        <span>Conteúdo do popover</span>
      </Popover>
    )
    await userEvent.click(screen.getByText('Abrir'))
    expect(screen.getByText('Conteúdo do popover')).toBeInTheDocument()
  })

  it('renders title when provided', async () => {
    render(
      <Popover trigger={<button>Abrir</button>} title="Título">
        <span>Conteúdo</span>
      </Popover>
    )
    await userEvent.click(screen.getByText('Abrir'))
    expect(screen.getByText('Título')).toBeInTheDocument()
  })

  it('calls onOpenChange when opening', async () => {
    const onOpenChange = vi.fn()
    render(
      <Popover trigger={<button>Abrir</button>} onOpenChange={onOpenChange}>
        <span>x</span>
      </Popover>
    )
    await userEvent.click(screen.getByText('Abrir'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
