import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KitchenCardSkeleton } from './KitchenCardSkeleton'

describe(KitchenCardSkeleton.name, () => {
  it('renders the loading ticket structure', () => {
    render(<KitchenCardSkeleton />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
