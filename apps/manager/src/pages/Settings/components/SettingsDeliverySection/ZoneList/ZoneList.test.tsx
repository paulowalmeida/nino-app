import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ZoneList } from './ZoneList'

describe('ZoneList', () => {
  it('shows the empty state', () => {
    render(<ZoneList zones={[]} isPending={false} isAdding={false} onAdd={() => undefined} onEdit={() => undefined} onToggle={() => undefined} onRemove={() => undefined} />)
    expect(screen.getByText(/Nenhuma região cadastrada/)).toBeInTheDocument()
  })
})
