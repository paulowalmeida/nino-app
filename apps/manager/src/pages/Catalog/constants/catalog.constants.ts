export const CATALOG_PAGE_SIZE = 20

export const MENU_BOARD_GHOST_ROWS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
]

export const CATALOG_CAPABILITIES = [
  {
    icon: 'plus',
    title: 'Cadastrar itens',
    description: 'Nome, preço, foto e opções de cada produto do cardápio.',
  },
  {
    icon: 'tag',
    title: 'Organizar por categorias',
    description: 'Agrupe os itens para o cliente encontrar tudo mais rápido.',
  },
  {
    icon: 'eye-off',
    title: 'Desligar o que acabou',
    description: 'O item some do app do cliente na hora, sem apagar nada.',
  },
  {
    icon: 'shopping-bag',
    title: 'Vender no balcão',
    description: 'Os itens ativos aparecem no balcão e no app do cliente.',
  },
] as const
