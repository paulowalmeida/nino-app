import { describe, expect, it, vi } from 'vitest'

const { create } = vi.hoisted(() => ({
  create: vi.fn().mockResolvedValue({ id: 'hour-1' }),
}))

vi.mock('@services/api/api.service', () => ({
  ApiFactory: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    create,
    update: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  }),
}))

const { createOpeningHours } = await import('./settings.service')

describe(createOpeningHours.name, () => {
  /**
   * O default de `is_open` no banco é `true`: omitir o campo faz um dia
   * criado como fechado voltar aberto da API, apagando a escolha em silêncio.
   */
  it('sends isOpen so a day created as closed stays closed', async () => {
    await createOpeningHours('tenant-1', {
      dayOfWeek: 3,
      openTime: '18:00',
      closeTime: '23:00',
      isOpen: false,
    })

    expect(create).toHaveBeenCalledWith('tenants/tenant-1/opening-hours', {
      dayOfWeek: 3,
      openTime: '18:00',
      closeTime: '23:00',
      isOpen: false,
    })
  })
})
