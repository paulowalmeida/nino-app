import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Kitchen } from './Kitchen'

vi.mock('./components/KitchenBoard/KitchenBoard', () => ({ KitchenBoard: () => <div>kitchen board</div> }))

describe(Kitchen.name, () => {
  it('composes the kitchen board inside the screen', () => {
    render(<Kitchen />)
    expect(screen.getByText('kitchen board')).toBeInTheDocument()
  })
})
