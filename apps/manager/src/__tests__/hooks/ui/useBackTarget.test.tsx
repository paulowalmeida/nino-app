import { MemoryRouter } from 'react-router'
import type { ReactNode } from 'react'

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useBackTarget } from '@hooks/ui/useBackTarget'

import { customerOrigin, ordersFallback } from './useBackTarget.mock'

const wrapAtEntry = (state: unknown) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[{ pathname: '/pedidos/order-1', state }]}>
      {children}
    </MemoryRouter>
  )

  return Wrapper
}

describe(useBackTarget.name, () => {
  it('returns the origin the navigation carried along', () => {
    // Arrange / Act
    const { result } = renderHook(() => useBackTarget(ordersFallback), {
      wrapper: wrapAtEntry({ from: customerOrigin }),
    })

    // Assert
    expect(result.current).toEqual(customerOrigin)
  })

  it('falls back when the screen was opened straight from the url', () => {
    // Arrange / Act
    const { result } = renderHook(() => useBackTarget(ordersFallback), {
      wrapper: wrapAtEntry(null),
    })

    // Assert
    expect(result.current).toEqual(ordersFallback)
  })

  it('falls back when the carried origin is missing its label', () => {
    // Arrange / Act
    const { result } = renderHook(() => useBackTarget(ordersFallback), {
      wrapper: wrapAtEntry({ from: { to: '/clientes/customer-1' } }),
    })

    // Assert
    expect(result.current).toEqual(ordersFallback)
  })
})
