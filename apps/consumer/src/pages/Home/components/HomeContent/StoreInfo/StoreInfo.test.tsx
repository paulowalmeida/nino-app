import { describe, expect, it } from 'vitest'
import { StoreInfo } from './StoreInfo'
import { storeInfoMock } from './StoreInfo.mock'

describe('StoreInfo', () => { it('exports the store information contract', () => { expect(StoreInfo).toBeDefined(); expect(storeInfoMock.open).toBe(false) }) })
