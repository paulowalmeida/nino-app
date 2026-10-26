import { beforeEach, describe, expect, it } from 'vitest'

import { useCheckoutStore } from './checkout.state'
import { checkoutStateMock } from './checkout.state.mock'

describe('useCheckoutStore', () => {
  beforeEach(() => {
    useCheckoutStore.setState({ slug: undefined })
  })

  it('stores the slug resolved from the route', () => {
    // Arrange
    const store = useCheckoutStore.getState()
    // Act
    store.setSlug(checkoutStateMock.slug)
    // Assert
    expect(useCheckoutStore.getState().slug).toBe(checkoutStateMock.slug)
  })

  it('clears the slug when the route has none', () => {
    // Arrange
    const store = useCheckoutStore.getState()
    store.setSlug(checkoutStateMock.slug)
    // Act
    store.setSlug(undefined)
    // Assert
    expect(useCheckoutStore.getState().slug).toBeUndefined()
  })
})
