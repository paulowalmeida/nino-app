import { describe, expect, it, vi } from 'vitest'

import type { SetCheckoutState } from '@pages/checkout/types/SetCheckoutState.type'

import { setSlug } from './slug'
import { slugMock } from './slug.mock'

describe('slug operations', () => {
  it('stores the resolved slug', () => {
    // Arrange
    const set = vi.fn() as unknown as SetCheckoutState
    // Act
    setSlug(set, slugMock)
    // Assert
    expect(set).toHaveBeenCalledWith({ slug: slugMock })
  })

  it('clears the slug when the route has none', () => {
    // Arrange
    const set = vi.fn() as unknown as SetCheckoutState
    // Act
    setSlug(set, undefined)
    // Assert
    expect(set).toHaveBeenCalledWith({ slug: undefined })
  })
})
