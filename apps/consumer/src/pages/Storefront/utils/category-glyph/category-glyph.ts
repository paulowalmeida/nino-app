import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

export type CategoryGlyphName =
  | 'lanches'
  | 'porcoes'
  | 'pizzas'
  | 'bebidas'
  | 'sobremesas'
  | 'combos'
  | 'pratos'
  | 'default'

const GLYPH_BY_ICON: Partial<Record<ProductCategoryIcon, CategoryGlyphName>> = {
  burger: 'lanches',
  sides: 'porcoes',
  snacks: 'porcoes',
  pizza: 'pizzas',
  drinks: 'bebidas',
  beer: 'bebidas',
  coffee: 'bebidas',
  dessert: 'sobremesas',
  acai: 'sobremesas',
  'ice-cream': 'sobremesas',
  bakery: 'sobremesas',
  combo: 'combos',
  marmita: 'combos',
  plate: 'pratos',
  meat: 'pratos',
  chicken: 'pratos',
  pasta: 'pratos',
  salad: 'pratos',
  veg: 'pratos',
  japanese: 'pratos',
  skewer: 'pratos',
}

/** WHY: categoria sem ícone escolhido ainda ganha o desenho certo pelo nome. */
const GLYPH_BY_NAME: [RegExp, CategoryGlyphName][] = [
  [/pizza/i, 'pizzas'],
  [/lanche|hamb[uú]rguer|burg|sandu[ií]che|x-/i, 'lanches'],
  [/por[çc][ãa]o|porções|salgad|fritas|petisco/i, 'porcoes'],
  [/bebida|refri|suco|cerveja|caf[eé]|drink|vinho|[áa]gua/i, 'bebidas'],
  [/sobremesa|doce|sorvete|a[çc]a[íi]|bolo|padaria/i, 'sobremesas'],
  [/combo|marmita|promo/i, 'combos'],
  [/prato|massa|carne|frango|salada|executivo/i, 'pratos'],
]

export const categoryGlyph = (
  name: string,
  icon?: ProductCategoryIcon | null
): CategoryGlyphName =>
  (icon ? GLYPH_BY_ICON[icon] : undefined) ??
  GLYPH_BY_NAME.find(([pattern]) => pattern.test(name))?.[1] ??
  'default'
