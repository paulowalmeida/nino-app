import { describe, expect, it } from 'vitest'
import { CartDock } from './CartDock'
import { cartDockMock } from './CartDock.mock'

describe('CartDock', () => { it('exports the cart dock contract', () => { expect(CartDock).toBeDefined(); expect(cartDockMock.count).toBeGreaterThan(0) }) })
