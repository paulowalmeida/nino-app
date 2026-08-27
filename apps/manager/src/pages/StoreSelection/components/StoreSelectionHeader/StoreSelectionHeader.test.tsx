import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StoreSelectionHeader } from './StoreSelectionHeader'
import { storeSelectionHeaderMock } from './StoreSelectionHeader.mock'

describe('StoreSelectionHeader', () => {
  it('names the screen and what the owner needs to do', () => {
    render(<StoreSelectionHeader />)

    expect(
      screen.getByRole('heading', { name: storeSelectionHeaderMock.heading })
    ).toBeInTheDocument()
    expect(
      screen.getByText(storeSelectionHeaderMock.subtitle)
    ).toBeInTheDocument()
  })
})
