import { vi } from 'vitest'

export const apiMock = {
  getAll: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  createFormData: vi.fn(),
  update: vi.fn(),
  patch: vi.fn(),
  remove: vi.fn(),
}
