import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CategoryBar } from './CategoryBar'
import { categoryBarMock } from './CategoryBar.mock'

describe('CategoryBar', () => {
  it('renders its category content', () => {
    render(<CategoryBar>{categoryBarMock.label}</CategoryBar>)
    expect(screen.getByText(categoryBarMock.label)).toBeInTheDocument()
  })
})
