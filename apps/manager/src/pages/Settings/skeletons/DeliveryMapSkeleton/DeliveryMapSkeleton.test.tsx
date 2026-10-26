import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DeliveryMapSkeleton } from './DeliveryMapSkeleton'
import { deliveryMapSkeletonMock } from './DeliveryMapSkeleton.mock'

describe('DeliveryMapSkeleton', () => {
  it('announces that the delivery area is loading', () => {
    render(<DeliveryMapSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando a área de atendimento'
    )
  })

  it('draws the header lines and the map frame', () => {
    const { container } = render(<DeliveryMapSkeleton />)

    const bones = container.querySelectorAll('[aria-hidden="true"]')

    expect(bones).toHaveLength(deliveryMapSkeletonMock.placeholderBoneCount)
  })
})
