import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'

/** Nome do arquivo em `public/category-icons/`. */
export type CategoryGlyphName =
  | 'acai'
  | 'asinhas'
  | 'bebidas'
  | 'bolo'
  | 'cafe'
  | 'cafe-da-manha'
  | 'carnes'
  | 'cerveja'
  | 'chinesa'
  | 'churrasco'
  | 'combos'
  | 'congelados'
  | 'coxinha'
  | 'default'
  | 'doces'
  | 'esfiha'
  | 'espetinho'
  | 'frango-frito'
  | 'frutos-do-mar'
  | 'japonesa'
  | 'lanches'
  | 'lasanha'
  | 'marmita'
  | 'massas'
  | 'mercado'
  | 'milkshake'
  | 'noodles'
  | 'padaria'
  | 'pastel'
  | 'peixe'
  | 'pizzas'
  | 'poke'
  | 'porcoes'
  | 'prato-feito'
  | 'pratos'
  | 'refrigerante'
  | 'salada'
  | 'sanduiche'
  | 'saudavel'
  | 'shawarma'
  | 'sobremesas'
  | 'sopas'
  | 'sorvete'
  | 'sucos'
  | 'tacos'
  | 'tapioca'
  | 'vegetariano'

const GLYPH_BY_ICON: Partial<Record<ProductCategoryIcon, CategoryGlyphName>> = {
  combo: 'combos',
  burger: 'lanches',
  pizza: 'pizzas',
  japanese: 'japonesa',
  skewer: 'espetinho',
  meat: 'carnes',
  chicken: 'frango-frito',
  pasta: 'massas',
  plate: 'prato-feito',
  marmita: 'marmita',
  sides: 'porcoes',
  snacks: 'coxinha',
  salad: 'salada',
  veg: 'vegetariano',
  dessert: 'doces',
  acai: 'acai',
  'ice-cream': 'sorvete',
  bakery: 'padaria',
  coffee: 'cafe',
  drinks: 'refrigerante',
  beer: 'cerveja',
}

/**
 * WHY: categoria sem ícone escolhido ainda ganha o desenho certo pelo nome.
 * Ordem importa: o específico vem antes do guarda-chuva ("milkshake" antes de
 * "doces", "café da manhã" antes de "café").
 */
const GLYPH_BY_NAME: [RegExp, CategoryGlyphName][] = [
  [/caf[eé] da manh[ãa]|brunch|desjejum/i, 'cafe-da-manha'],
  [/milk ?shake/i, 'milkshake'],
  [/a[çc]a[íi]/i, 'acai'],
  [/sorvete|gelato|picol[eé]/i, 'sorvete'],
  [/bolo|torta|cupcake|confeitaria/i, 'bolo'],
  [/doce|brigadeiro|sobremesa|chocolate/i, 'doces'],
  [/cerveja|chope|chopp|beer/i, 'cerveja'],
  [/suco|vitamina|smoothie/i, 'sucos'],
  [/refri|refrigerante|bebida|drink|[áa]gua/i, 'refrigerante'],
  [/caf[eé]|cafeteria|cappuccino/i, 'cafe'],
  [/poke/i, 'poke'],
  [/sushi|japon|temaki|sashimi|hot ?roll/i, 'japonesa'],
  [/yakisoba|l[áa]men|noodle|macarr[ãa]o chin/i, 'noodles'],
  [/chin[eê]s|oriental|asi[áa]tic/i, 'chinesa'],
  [/esfiha|esfirra|[áa]rabe|kibe|quibe/i, 'esfiha'],
  [/shawarma|kebab|kebap|d[öo]ner|wrap/i, 'shawarma'],
  [/taco|burrito|mexican|nacho/i, 'tacos'],
  [/lasanha|parmegian|italian/i, 'lasanha'],
  [/massa|macarr[ãa]o|espaguete|nhoque|ravioli/i, 'massas'],
  [/pizza/i, 'pizzas'],
  [/espetinho|espeto/i, 'espetinho'],
  [/churrasco|grelhad|parrilla|bbq/i, 'churrasco'],
  [/carne|bife|picanha|steak|costela/i, 'carnes'],
  [/asinha|wings|coxinha da asa/i, 'asinhas'],
  [/frango|galeto|chicken/i, 'frango-frito'],
  [/camar[ãa]o|frutos do mar|mariscos|lula|polvo/i, 'frutos-do-mar'],
  [/peixe|til[áa]pia|salm[ãa]o|bacalhau/i, 'peixe'],
  [/marmit/i, 'marmita'],
  [
    /prato feito|\bpf\b|executivo|almo[çc]o|comida caseira|self.?service/i,
    'prato-feito',
  ],
  [/coxinha|salgad|empada|risole/i, 'coxinha'],
  [/pastel|pastelaria/i, 'pastel'],
  [/tapioca|crepe/i, 'tapioca'],
  [/sandu[ií]che|natural|misto|baguete/i, 'sanduiche'],
  [/lanche|hamb[uú]rguer|burg|x-/i, 'lanches'],
  [/padaria|p[ãa]es|p[ãa]o|croissant/i, 'padaria'],
  [/sopa|caldo|canja/i, 'sopas'],
  [/vegan|vegetarian|veggie/i, 'vegetariano'],
  [/salada/i, 'salada'],
  [/saud[áa]vel|fit|light|bowl/i, 'saudavel'],
  [/por[çc][ãa]o|por[çc][õo]es|fritas|petisco/i, 'porcoes'],
  [/combo|promo/i, 'combos'],
  [/congelad/i, 'congelados'],
  [/mercado|conveni[êe]ncia|mercearia/i, 'mercado'],
  [/prato|refei[çc][ãa]o/i, 'pratos'],
]

export const categoryGlyph = (
  name: string,
  icon?: ProductCategoryIcon | null
): CategoryGlyphName =>
  (icon ? GLYPH_BY_ICON[icon] : undefined) ??
  GLYPH_BY_NAME.find(([pattern]) => pattern.test(name))?.[1] ??
  'default'
