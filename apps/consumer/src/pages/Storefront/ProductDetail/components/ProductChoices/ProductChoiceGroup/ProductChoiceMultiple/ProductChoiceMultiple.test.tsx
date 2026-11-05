import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import { ProductChoiceMultiple } from './ProductChoiceMultiple'

vi.mock(
  '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
)

const group = {
  id: 'extras',
  name: 'Extras',
  role: 'ADDITION',
  minSelections: 0,
  maxSelections: 2,
  isRequired: false,
  options: [
    { id: 'cheese', name: 'Queijo', price: '2' },
    { id: 'bacon', name: 'Bacon', price: '3' },
    { id: 'onion', name: 'Cebola', price: '0' },
  ],
} as never

describe('ProductChoiceMultiple', () => {
  it('disables excess choices and explains the selection limit', () => {
    const toggleChoice = vi.fn()
    vi.mocked(useProductDetailFacade).mockReturnValue({
      selections: { extras: ['cheese', 'bacon'] },
      toggleChoice,
    } as never)

    render(<ProductChoiceMultiple group={group} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Você já escolheu o máximo de 2 opções.'
    )
    expect(screen.getByRole('checkbox', { name: 'Cebola' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: /^Queijo/ })).not.toBeDisabled()
  })
})
