export const CATEGORIES_HAS_PRODUCTS_HINT =
  'Essa categoria ainda tem produtos. Mova ou exclua os produtos antes de ' +
  'excluir a categoria.'

export const CATEGORIES_GENERIC_DELETE_ERROR =
  'Não foi possível excluir. Tente de novo.'

export const CATEGORIES_DESCRIPTION =
  'As categorias agrupam os itens no app do cliente. Arraste para mudar ' +
  'a ordem em que aparecem lá.'

export const CATEGORIES_GHOST_ROWS = ['first', 'second', 'third']

export const CATEGORIES_CAPABILITIES = [
  {
    icon: 'tag',
    title: 'Criar categorias',
    description: 'Lanches, bebidas, sobremesas: o nome que o cliente vê.',
  },
  {
    icon: 'menu',
    title: 'Definir a ordem',
    description: 'Arraste para mudar a sequência em que aparecem no app.',
  },
  {
    icon: 'edit',
    title: 'Renomear quando precisar',
    description: 'Os itens da categoria continuam onde estão.',
  },
  {
    icon: 'box',
    title: 'Agrupar os itens',
    description: 'Cada item do cardápio mora dentro de uma categoria.',
  },
] as const
