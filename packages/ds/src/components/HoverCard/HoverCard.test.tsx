import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HoverCard } from './HoverCard'

describe(HoverCard.name, () => {
  it('renders the trigger', () => {
    render(<HoverCard trigger={<button>Loja</button>}>preview</HoverCard>)
    expect(screen.getByRole('button', { name: 'Loja' })).toBeInTheDocument()
  })

  it('keeps the content closed until hovered', () => {
    render(<HoverCard trigger={<button>Loja</button>}>preview</HoverCard>)
    expect(screen.queryByText('preview')).not.toBeInTheDocument()
  })
})
