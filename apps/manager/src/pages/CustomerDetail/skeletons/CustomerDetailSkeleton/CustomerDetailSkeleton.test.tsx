import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerDetailSkeleton } from './CustomerDetailSkeleton'
import { customerDetailSkeletonMock } from './CustomerDetailSkeleton.mock'

describe('CustomerDetailSkeleton', () => {
  it('announces loading and mirrors the customer detail layout', () => {
    const { container } = render(
      <MemoryRouter>
        <CustomerDetailSkeleton />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toHaveTextContent('Carregando cliente')
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(customerDetailSkeletonMock.placeholderOrderCount)
    expect(screen.getByRole('region', { name: 'Resumo' })).toBeInTheDocument()
  })
})
