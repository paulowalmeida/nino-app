import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnitCardSkeleton } from './UnitCardSkeleton'
import { unitCardSkeletonMock } from './UnitCardSkeleton.mock'

describe(UnitCardSkeleton.name, () => {
  it('announces that the unit data is loading', () => {
    render(<UnitCardSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando os dados da unidade'
    )
  })

  it('draws every ghost bone that mirrors the real form', () => {
    const { container } = render(<UnitCardSkeleton />)

    const bones = container.querySelectorAll('[aria-hidden="true"]')

    expect(bones).toHaveLength(unitCardSkeletonMock.placeholderBoneCount)
  })
})
