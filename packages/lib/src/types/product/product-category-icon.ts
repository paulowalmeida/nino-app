/**
 * WHY: são seções de cardápio, não ingredientes. O nome tem que ser o que o
 * dono escreveria no próprio cardápio ("Porções", "Marmitas"), e a ordem
 * agrupa por afinidade — vitrine, salgado, acompanhamento, doce, bebida.
 */
export const PRODUCT_CATEGORY_ICONS = [
  { value: 'featured', label: 'Destaques', emoji: '⭐' },
  { value: 'promo', label: 'Promoções', emoji: '🏷️' },
  { value: 'combo', label: 'Combos', emoji: '🍱' },

  { value: 'burger', label: 'Lanches', emoji: '🍔' },
  { value: 'pizza', label: 'Pizzas', emoji: '🍕' },
  { value: 'japanese', label: 'Japonesa', emoji: '🍣' },
  { value: 'skewer', label: 'Espetinhos', emoji: '🍢' },
  { value: 'meat', label: 'Carnes', emoji: '🥩' },
  { value: 'chicken', label: 'Frango', emoji: '🍗' },
  { value: 'pasta', label: 'Massas', emoji: '🍝' },
  { value: 'plate', label: 'Pratos feitos', emoji: '🍛' },
  { value: 'marmita', label: 'Marmitas', emoji: '🥡' },

  { value: 'sides', label: 'Porções', emoji: '🍟' },
  { value: 'snacks', label: 'Salgados', emoji: '🥟' },
  { value: 'salad', label: 'Saladas', emoji: '🥗' },
  { value: 'veg', label: 'Vegetariano', emoji: '🌱' },

  { value: 'dessert', label: 'Sobremesas', emoji: '🍰' },
  { value: 'acai', label: 'Açaí', emoji: '🍨' },
  { value: 'ice-cream', label: 'Sorvetes', emoji: '🍦' },
  { value: 'bakery', label: 'Padaria', emoji: '🥐' },

  { value: 'coffee', label: 'Cafés', emoji: '☕' },
  { value: 'drinks', label: 'Bebidas', emoji: '🥤' },
  { value: 'beer', label: 'Cervejas', emoji: '🍺' },
] as const

export type ProductCategoryIcon =
  (typeof PRODUCT_CATEGORY_ICONS)[number]['value']

export const productCategoryIconEmoji = (
  icon: ProductCategoryIcon | null | undefined
): string | null =>
  PRODUCT_CATEGORY_ICONS.find((option) => option.value === icon)?.emoji ?? null
