import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PersonalizeSkeleton } from './PersonalizeSkeleton'
import { personalizeSkeletonMock } from './PersonalizeSkeleton.mock'

describe(PersonalizeSkeleton.name, () => {
  it('announces the loading screen to assistive tech', () => {
    render(<PersonalizeSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando a personalização da loja'
    )
  })

  it('mirrors the studio layout while the unit loads', () => {
    const { container } = render(<PersonalizeSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      personalizeSkeletonMock.placeholderBoneCount
    )
  })
})
