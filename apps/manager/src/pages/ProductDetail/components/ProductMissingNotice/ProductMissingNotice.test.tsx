import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductMissingNotice } from './ProductMissingNotice'
import { productMissingNoticeMock } from './ProductMissingNotice.mock'

describe('ProductMissingNotice', () => {
  it('explains why there is no item to edit', () => {
    render(<ProductMissingNotice />)

    expect(
      screen.getByText(productMissingNoticeMock.message)
    ).toBeInTheDocument()
  })
})
