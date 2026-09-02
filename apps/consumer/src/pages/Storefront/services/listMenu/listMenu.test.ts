import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@shared/services/http/http.service'
import { listMenu } from './listMenu'
import { listMenuMock } from './listMenu.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe('listMenu', () => {
  beforeEach(() => vi.clearAllMocks())

  it('requests the public menu with the supported page size', async () => {
    vi.mocked(api.getAll).mockResolvedValue({
      data: [],
      pagination: { total: 0 },
    } as never)
    await listMenu(listMenuMock.tenantId)
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${listMenuMock.tenantId}/products`,
      { size: 100, page: 1 }
    )
  })

  it('loads all menu pages when the store has more than 100 products', async () => {
    vi.mocked(api.getAll)
      .mockResolvedValueOnce({
        data: Array.from({ length: 100 }, () => ({ id: 'item' })),
        pagination: { total: 101 },
      } as never)
      .mockResolvedValueOnce({
        data: [{ id: 'item-101' }],
        pagination: { total: 101 },
      } as never)

    const result = await listMenu(listMenuMock.tenantId)

    expect(result.data).toHaveLength(101)
    expect(api.getAll).toHaveBeenNthCalledWith(
      2,
      `tenants/${listMenuMock.tenantId}/products`,
      { size: 100, page: 2 }
    )
  })
})
