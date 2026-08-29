import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TableTabsListSkeleton } from './TableTabsListSkeleton'
import { tableTabsListSkeletonMock } from './TableTabsListSkeleton.mock'

describe('TableTabsListSkeleton', () => {
  it('announces loading and mirrors the tab cards', () => {
    const { container } = render(<TableTabsListSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      tableTabsListSkeletonMock.status
    )
    expect(container.querySelectorAll('li')).toHaveLength(
      tableTabsListSkeletonMock.cardCount
    )
  })
})
