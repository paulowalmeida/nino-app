import { describe, expect, it } from 'vitest'

import { queryKeys } from './query-keys'
import {
  queryKeyCategoryIdMock,
  queryKeyGranularityMock,
  queryKeyOtherUnitIdMock,
  queryKeyReportRangeMock,
  queryKeySearchMock,
  queryKeyUnitIdMock,
} from './query-keys.mock'

describe('queryKeys', () => {
  it('keeps cache roots isolated by unit', () => {
    expect(queryKeys.products.all(queryKeyUnitIdMock)).not.toEqual(
      queryKeys.products.all(queryKeyOtherUnitIdMock)
    )
    expect(queryKeys.unit.settings(queryKeyUnitIdMock)).toEqual([
      'unit',
      queryKeyUnitIdMock,
      'settings',
    ])
  })

  it('includes every catalog filter in the product key', () => {
    expect(
      queryKeys.products.catalog(
        queryKeyUnitIdMock,
        queryKeyCategoryIdMock,
        queryKeySearchMock
      )
    ).toEqual([
      'products',
      queryKeyUnitIdMock,
      'catalog',
      queryKeyCategoryIdMock,
      queryKeySearchMock,
    ])
  })

  it('includes the report range and granularity in analytics keys', () => {
    expect(
      queryKeys.orders.series(
        queryKeyUnitIdMock,
        queryKeyReportRangeMock,
        queryKeyGranularityMock
      )
    ).toEqual([
      'orders',
      queryKeyUnitIdMock,
      'series',
      'range',
      '2026-01-01',
      '2026-01-31',
      queryKeyGranularityMock,
    ])
  })

  it('keeps distinct date ranges distinct when values contain separators', () => {
    expect(
      queryKeys.orders.report(queryKeyUnitIdMock, {
        from: 'a:b',
        to: 'c',
      })
    ).not.toEqual(
      queryKeys.orders.report(queryKeyUnitIdMock, {
        from: 'a',
        to: 'b:c',
      })
    )
  })
})
