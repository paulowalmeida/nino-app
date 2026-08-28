import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorDetailSkeleton } from './CollaboratorDetailSkeleton'
import { collaboratorDetailSkeletonMock } from './CollaboratorDetailSkeleton.mock'

const { placeholderBoneCount } = collaboratorDetailSkeletonMock

const renderSkeleton = () =>
  render(
    <MemoryRouter>
      <CollaboratorDetailSkeleton />
    </MemoryRouter>
  )

describe('CollaboratorDetailSkeleton', () => {
  it('announces that the person is loading', () => {
    renderSkeleton()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando a pessoa')
  })

  it('composes every region of the collaborator sheet', () => {
    // Arrange
    const { container } = renderSkeleton()

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(screen.getByLabelText('Resumo do trabalho')).toBeVisible()
    expect(screen.getByLabelText('Contato')).toBeVisible()
    expect(screen.getByLabelText('Atividade recente')).toBeVisible()
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
