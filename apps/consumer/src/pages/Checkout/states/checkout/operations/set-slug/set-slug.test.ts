import { describe, expect, it, vi } from 'vitest'

import type { SetCheckoutState } from '@pages/checkout/types/SetCheckoutState.type'

import { setSlug } from './set-slug'
import { setSlugMock } from './set-slug.mock'

describe('setSlug', () => {
  it('stores the resolved slug', () => {
    const set = vi.fn() as unknown as SetCheckoutState

    setSlug(set, setSlugMock.slug)

    expect(set).toHaveBeenCalledWith({ slug: setSlugMock.slug })
  })

  it('clears the slug when the route has none', () => {
    const set = vi.fn() as unknown as SetCheckoutState

    setSlug(set, undefined)

    expect(set).toHaveBeenCalledWith({ slug: undefined })
  })
})
