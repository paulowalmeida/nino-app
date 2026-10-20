import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { PositionsService } from './positions.service'
import {
  permissionCatalogMock,
  positionDraftMock,
  positionIdMock,
  positionMock,
  removedMessageMock,
  unitIdMock,
} from './positions.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('PositionsService', () => {
  afterEach(() => vi.clearAllMocks())

  it('list: reads the unit cargos', async () => {
    vi.mocked(api.get).mockResolvedValue([positionMock])

    const result = await PositionsService.list(unitIdMock)

    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/positions`)
    expect(result).toEqual([positionMock])
  })

  it('listPermissions: reads the permission catalog', async () => {
    vi.mocked(api.get).mockResolvedValue(permissionCatalogMock)

    const result = await PositionsService.listPermissions(unitIdMock)

    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/positions/permissions`
    )
    expect(result).toBe(permissionCatalogMock)
  })

  it('create: posts a new cargo', async () => {
    vi.mocked(api.create).mockResolvedValue(positionMock)

    const result = await PositionsService.create(unitIdMock, positionDraftMock)

    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/positions`,
      positionDraftMock
    )
    expect(result).toBe(positionMock)
  })

  it('update: patches a cargo', async () => {
    vi.mocked(api.patch).mockResolvedValue(positionMock)

    const result = await PositionsService.update(
      unitIdMock,
      positionIdMock,
      positionDraftMock
    )

    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/positions/${positionIdMock}`,
      positionDraftMock
    )
    expect(result).toBe(positionMock)
  })

  it('duplicate: posts a copy request', async () => {
    vi.mocked(api.create).mockResolvedValue(positionMock)

    const result = await PositionsService.duplicate(unitIdMock, positionIdMock)

    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/positions/${positionIdMock}/duplicate`,
      {}
    )
    expect(result).toBe(positionMock)
  })

  it('remove: deletes a cargo', async () => {
    vi.mocked(api.remove).mockResolvedValue(removedMessageMock)

    const result = await PositionsService.remove(unitIdMock, positionIdMock)

    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/positions/${positionIdMock}`
    )
    expect(result).toBe(removedMessageMock)
  })
})
