import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ZoneFormSkeleton } from './ZoneFormSkeleton'
import { zoneFormSkeletonMock } from './ZoneFormSkeleton.mock'

const { placeholderFieldCount, placeholderBoneCount } = zoneFormSkeletonMock

describe('ZoneFormSkeleton', () => {
  it('announces that the range form is loading', () => {
    render(<ZoneFormSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando o formulário de faixas'
    )
  })

  it('draws a bone for every field, the slider and the submit', () => {
    const { container } = render(<ZoneFormSkeleton />)

    const bones = container.querySelectorAll('[aria-hidden="true"]')

    expect(bones.length).toBeGreaterThanOrEqual(placeholderFieldCount)
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
