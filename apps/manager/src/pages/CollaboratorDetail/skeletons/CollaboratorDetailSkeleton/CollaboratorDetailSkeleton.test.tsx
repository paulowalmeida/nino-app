import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorDetailSkeleton } from './CollaboratorDetailSkeleton'

describe(CollaboratorDetailSkeleton.name, () => {
  it('announces loading and renders collaborator detail placeholders', () => {
    const { container } = render(
      <MemoryRouter>
        <CollaboratorDetailSkeleton />
      </MemoryRouter>
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando colaborador'
    )
    expect(container.querySelectorAll('[aria-hidden="true"]')).not.toHaveLength(
      0
    )
  })
})
