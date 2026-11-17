import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import { ProductAddBar } from './ProductAddBar'
import { productAddBarMock } from './ProductAddBar.mock'

vi.mock('./ProductAddBar.module.css', () => ({ default: {} }))
vi.mock(
  '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade',
  () => ({ useProductDetailFacade: vi.fn() })
)
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}))
vi.mock('@nino/ds/components/Button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children?: ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))
vi.mock('@nino/ds/components/QuantityStepper', () => ({
  QuantityStepper: ({
    isDecrementDisabled,
  }: {
    isDecrementDisabled?: boolean
  }) => (
    <div data-testid="stepper" data-decrement-disabled={isDecrementDisabled} />
  ),
}))
vi.mock('@shared/components/AnimatedNumber/AnimatedNumber', () => ({
  AnimatedNumber: ({ value }: { value: string | number }) => (
    <span>{value}</span>
  ),
}))

const mockFacade = (overrides: object) =>
  vi.mocked(useProductDetailFacade).mockReturnValue({
    ...productAddBarMock,
    setQuantity: vi.fn(),
    addToBag: vi.fn(),
    isEditing: false,
    ...overrides,
  } as never)

describe('ProductAddBar', () => {
  it('offers to add a new item', () => {
    mockFacade({})
    render(<ProductAddBar />)

    expect(screen.getByRole('button')).toHaveTextContent('Adicionar')
    expect(screen.getByTestId('stepper')).toHaveAttribute(
      'data-decrement-disabled',
      'false'
    )
  })

  it('confirms an edit with "Atualizar sacola"', () => {
    const addToBag = vi.fn()
    mockFacade({ isEditing: true, addToBag })
    render(<ProductAddBar />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveTextContent('Atualizar sacola')
    expect(addToBag).toHaveBeenCalledTimes(1)
  })

  it('turns into a removal at quantity zero while editing', () => {
    mockFacade({ isEditing: true, quantity: 0, total: 0 })
    render(<ProductAddBar />)

    expect(screen.getByRole('button')).toHaveTextContent('Remover da sacola')
  })
})
