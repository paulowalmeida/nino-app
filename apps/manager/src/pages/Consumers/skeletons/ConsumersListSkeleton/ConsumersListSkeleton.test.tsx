import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumersListSkeleton } from './ConsumersListSkeleton'
import { consumersListSkeletonMock } from './ConsumersListSkeleton.mock'

describe('ConsumersListSkeleton', () => {
  it('announces loading', () => {
    render(<ConsumersListSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando clientes')
  })

  it('keeps the real column heads and mirrors every row cell', () => {
    const { container } = render(<ConsumersListSkeleton />)

    consumersListSkeletonMock.columns.forEach((column) =>
      expect(
        screen.getByRole('columnheader', { name: column, hidden: true })
      ).toBeInTheDocument()
    )
    expect(container.querySelectorAll('tbody tr')).toHaveLength(
      consumersListSkeletonMock.placeholderRowCount
    )
    expect(
      container.querySelectorAll('tbody [aria-hidden="true"]')
    ).toHaveLength(
      consumersListSkeletonMock.placeholderRowCount *
        consumersListSkeletonMock.placeholdersPerRow
    )
  })
})
