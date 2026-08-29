import { describe, expect, it } from 'vitest'
import { StoreIdentity } from './StoreIdentity'
import { storeIdentityMock } from './StoreIdentity.mock'

describe('StoreIdentity', () => { it('exports the store identity contract', () => { expect(StoreIdentity).toBeDefined(); expect(storeIdentityMock.isStoreOpen).toBe(true) }) })
