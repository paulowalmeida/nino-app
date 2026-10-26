import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import {
  DINING_TABLE_PAGE_SIZE,
  DiningTableService,
} from './dining-table.service'
import { diningTableServiceMock } from './dining-table.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    getAll: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

const { unitId, tableId } = diningTableServiceMock

describe('DiningTableService', () => {
  afterEach(() => vi.clearAllMocks())

  it('list: asks for every table of the store in name order', async () => {
    await DiningTableService.list(unitId)

    expect(api.getAll).toHaveBeenCalledWith('units/unit-1/dining-tables', {
      target: 'name',
      direction: 'asc',
      size: DINING_TABLE_PAGE_SIZE,
      page: 1,
    })
  })

  it('create and createBatch: post one table or a numbered batch', async () => {
    await DiningTableService.create(
      unitId,
      diningTableServiceMock.createRequest
    )
    await DiningTableService.createBatch(
      unitId,
      diningTableServiceMock.batchRequest
    )

    expect(api.create).toHaveBeenNthCalledWith(
      1,
      'units/unit-1/dining-tables',
      diningTableServiceMock.createRequest
    )
    expect(api.create).toHaveBeenNthCalledWith(
      2,
      'units/unit-1/dining-tables/batch',
      diningTableServiceMock.batchRequest
    )
  })

  it('update and remove: address the table by id', async () => {
    await DiningTableService.update(
      unitId,
      tableId,
      diningTableServiceMock.updateRequest
    )
    await DiningTableService.remove(unitId, tableId)

    expect(api.patch).toHaveBeenCalledWith(
      'units/unit-1/dining-tables/table-4',
      diningTableServiceMock.updateRequest
    )
    expect(api.remove).toHaveBeenCalledWith(
      'units/unit-1/dining-tables/table-4'
    )
  })
})
