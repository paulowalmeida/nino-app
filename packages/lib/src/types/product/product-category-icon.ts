export const PRODUCT_CATEGORY_ICONS = [
  { value: 'burger', label: 'Hambúrguer', emoji: '🍔' },
  { value: 'pizza', label: 'Pizza', emoji: '🍕' },
  { value: 'pasta', label: 'Massas', emoji: '🍝' },
  { value: 'meat', label: 'Carnes', emoji: '🥩' },
  { value: 'chicken', label: 'Frango', emoji: '🍗' },
  { value: 'fish', label: 'Peixes', emoji: '🐟' },
  { value: 'snacks', label: 'Salgados', emoji: '🥟' },
  { value: 'fries', label: 'Fritas', emoji: '🍟' },
  { value: 'salad', label: 'Saladas', emoji: '🥗' },
  { value: 'soup', label: 'Sopas', emoji: '🍲' },
  { value: 'breakfast', label: 'Café da manhã', emoji: '🍳' },
  { value: 'dessert', label: 'Sobremesas', emoji: '🍰' },
  { value: 'ice-cream', label: 'Sorvetes', emoji: '🍨' },
  { value: 'fruit', label: 'Frutas', emoji: '🍓' },
  { value: 'drinks', label: 'Bebidas', emoji: '🥤' },
  { value: 'beer', label: 'Cervejas', emoji: '🍺' },
  { value: 'coffee', label: 'Café', emoji: '☕' },
  { value: 'generic', label: 'Outros', emoji: '🍽️' },
] as const

export type ProductCategoryIcon =
  (typeof PRODUCT_CATEGORY_ICONS)[number]['value']

export const productCategoryIconEmoji = (
  icon: ProductCategoryIcon | null | undefined
): string | null =>
  PRODUCT_CATEGORY_ICONS.find((option) => option.value === icon)?.emoji ?? null
