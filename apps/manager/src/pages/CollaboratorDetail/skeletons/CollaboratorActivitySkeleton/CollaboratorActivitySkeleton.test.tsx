import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { COLLABORATOR_DETAIL_COLUMNS } from '@pages/CollaboratorDetail/constants/collaborator-detail.constants'

import { CollaboratorActivitySkeleton } from './CollaboratorActivitySkeleton'
import { collaboratorActivitySkeletonMock } from './CollaboratorActivitySkeleton.mock'

const { placeholderEntryRowCount, placeholderBoneCount } =
  collaboratorActivitySkeletonMock

describe('CollaboratorActivitySkeleton', () => {
  it('keeps the title and every column readable while the rows are bones', () => {
    // Arrange
    const { container } = render(<CollaboratorActivitySkeleton />)

    // Act
    const rows = container.querySelectorAll('tbody tr')

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Atividade recente' })
    ).toBeVisible()
    COLLABORATOR_DETAIL_COLUMNS.forEach((label) => {
      expect(screen.getByRole('columnheader', { name: label })).toBeVisible()
    })
    expect(rows).toHaveLength(placeholderEntryRowCount)
  })

  it('draws one bone per cell of every entry', () => {
    // Arrange
    const { container } = render(<CollaboratorActivitySkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
