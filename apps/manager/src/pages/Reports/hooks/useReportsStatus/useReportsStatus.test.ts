import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useReportsStatus } from './useReportsStatus'
import { reportsStatusMock } from './useReportsStatus.mock'

const { settled, pending, failed } = reportsStatusMock

const statusOf = (...args: Parameters<typeof useReportsStatus>) =>
  renderHook(() => useReportsStatus(...args)).result.current

describe('useReportsStatus', () => {
  it('waits for the dates before anything else', () => {
    expect(statusOf(true, true, [failed, pending], 0)).toBe('awaiting-dates')
  })

  it('fails when any query fails, even while others still load', () => {
    expect(statusOf(false, true, [pending, failed], undefined)).toBe('error')
  })

  it('fails when the chosen dates form no valid range', () => {
    expect(statusOf(false, false, [pending], undefined)).toBe('error')
  })

  it('stays pending until every query settles', () => {
    expect(statusOf(false, true, [settled, pending], 3)).toBe('pending')
  })

  it('is empty when the period has no completed order', () => {
    expect(statusOf(false, true, [settled, settled], 0)).toBe('empty')
  })

  it('is ready once everything settled with orders', () => {
    expect(statusOf(false, true, [settled, settled], 3)).toBe('ready')
  })
})
