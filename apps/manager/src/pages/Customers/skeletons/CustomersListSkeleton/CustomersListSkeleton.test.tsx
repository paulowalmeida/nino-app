import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomersListSkeleton } from './CustomersListSkeleton'
import { customersListSkeletonMock } from './CustomersListSkeleton.mock'

describe('CustomersListSkeleton', () => {
  it('announces loading and mirrors the list rows', () => {
    const { container } = render(<CustomersListSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando clientes')
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThanOrEqual(customersListSkeletonMock.placeholderRowCount * 5)
  })
})
