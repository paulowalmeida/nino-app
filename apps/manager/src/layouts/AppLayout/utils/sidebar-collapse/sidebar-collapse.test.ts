import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from './sidebar-collapse'
import { sidebarCollapseMock } from './sidebar-collapse.mock'

describe('sidebar collapse preference', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('reads the persisted collapsed value', () => {
    window.localStorage.setItem(sidebarCollapseMock.storageKey, '1')

    expect(readSidebarCollapsed()).toBe(true)
  })

  it('writes the expanded and collapsed values', () => {
    writeSidebarCollapsed(true)
    expect(window.localStorage.getItem(sidebarCollapseMock.storageKey)).toBe('1')

    writeSidebarCollapsed(false)
    expect(window.localStorage.getItem(sidebarCollapseMock.storageKey)).toBe('0')
  })

  it('falls back without throwing when browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(readSidebarCollapsed()).toBe(false)
    expect(() => writeSidebarCollapsed(true)).not.toThrow()
  })
})
