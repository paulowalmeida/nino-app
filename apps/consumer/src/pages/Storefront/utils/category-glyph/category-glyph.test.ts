import { describe, expect, it } from 'vitest'

import { categoryGlyph } from './category-glyph'

describe('categoryGlyph', () => {
  it('uses the configured icon first', () => {
    expect(categoryGlyph('Qualquer', 'acai')).toBe('acai')
  })

  it.each([
    ['Milkshakes', 'milkshake'],
    ['Doces e Bolos', 'bolo'],
    ['Café da manhã', 'cafe-da-manha'],
    ['Cafés', 'cafe'],
    ['Sucos naturais', 'sucos'],
    ['Comida caseira', 'prato-feito'],
    ['Espetinhos', 'espetinho'],
    ['Yakisoba', 'noodles'],
    ['Pizzas', 'pizzas'],
    ['Lanches', 'lanches'],
  ])('maps %s to %s by name', (name, glyph) => {
    expect(categoryGlyph(name)).toBe(glyph)
  })

  it('falls back to default', () => {
    expect(categoryGlyph('Diversos')).toBe('default')
  })
})
