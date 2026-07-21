import { describe, expect, it, vi } from 'vitest'

const { patch } = vi.hoisted(() => ({
  patch: vi.fn().mockResolvedValue({ id: 'item-1', position: 3 }),
}))

vi.mock('@services/api/api.service', () => ({
  ApiFactory: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch,
    remove: vi.fn(),
  }),
}))

const { setItemPosition } = await import('./product.service')

describe(setItemPosition.name, () => {
  it('patches the item with the new position', async () => {
    const result = await setItemPosition('tenant-1', 'item-1', 3)

    expect(patch).toHaveBeenCalledWith('tenants/tenant-1/products', 'item-1', {
      position: 3,
    })
    expect(result).toEqual({ id: 'item-1', position: 3 })
  })
})
