import { describe, expect, it, vi } from 'vitest'
import { api } from '@shared/services/http/http.service'
import { listMenu } from './listMenu'
import { listMenuMock } from './listMenu.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe('listMenu', () => {
  it('requests the public menu with the supported page size', async () => {
    vi.mocked(api.getAll).mockResolvedValue({ data: [] } as never)
    await listMenu(listMenuMock.tenantId)
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${listMenuMock.tenantId}/products`,
      { size: 100, page: 1 }
    )
  })
})
