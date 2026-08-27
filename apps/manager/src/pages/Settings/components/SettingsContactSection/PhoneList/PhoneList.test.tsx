import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PhoneList } from './PhoneList'

describe('PhoneList', () => {
  it('shows the empty state', () => {
    render(<PhoneList phones={[]} isPending={false} isAdding={false} onAdd={() => undefined} onEdit={() => undefined} onRemove={() => undefined} />)
    expect(screen.getByText('Nenhum telefone cadastrado.')).toBeInTheDocument()
  })
})
