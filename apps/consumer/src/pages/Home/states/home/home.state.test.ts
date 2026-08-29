import { beforeEach, describe, expect, it } from 'vitest'
import { useHomeInteractionStore } from './home.state'
import { homeInteractionStateMock } from './home.state.mock'

describe('useHomeInteractionStore', () => {
  beforeEach(() => {
    useHomeInteractionStore.setState({
      search: '',
      isCartOpen: false,
      isInfoOpen: false,
      selectedItem: null,
    })
  })

  it('keeps shared home interaction state outside the component tree', () => {
    useHomeInteractionStore
      .getState()
      .setSearch(homeInteractionStateMock.search)
    useHomeInteractionStore.getState().setCartOpen(true)
    expect(useHomeInteractionStore.getState()).toMatchObject({
      search: 'burger',
      isCartOpen: true,
    })
  })
})
