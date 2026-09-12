import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumersListSkeleton } from './ConsumersListSkeleton'
import { consumersListSkeletonMock } from './ConsumersListSkeleton.mock'

describe('ConsumersListSkeleton', () => {
  it('announces loading and mirrors the list rows', () => {
    const { container } = render(<ConsumersListSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando clientes')
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThanOrEqual(consumersListSkeletonMock.placeholderRowCount * 5)
  })
})
