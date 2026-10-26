import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressesSkeleton } from './AddressesSkeleton'
import { addressesSkeletonMock } from './AddressesSkeleton.mock'

describe('AddressesSkeleton', () => {
  it('announces the loading region', () => {
    render(<AddressesSkeleton />)

    expect(
      screen.getByLabelText(addressesSkeletonMock.accessibleName)
    ).toBeInTheDocument()
  })
})
