/* WHY: o primeiro rótulo alinha à esquerda e o resto acompanha o número. */
export const CONSUMERS_COLUMNS = [
  'Cliente',
  'Gasto',
  'Pedidos',
  'Cashback',
  'Cliente desde',
]

/* WHY: oito linhas preenchem a primeira tela antes de rolar. */
export const CONSUMERS_GHOST_ROWS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
]

export const CONSUMERS_CAPABILITIES = [
  {
    icon: 'search',
    title: 'Buscar clientes',
    description: 'Encontre alguém pelo nome ou pelo telefone.',
  },
  {
    icon: 'bag',
    title: 'Ver o histórico de pedidos',
    description: 'Quanto cada cliente já gastou e quantos pedidos fez.',
  },
  {
    icon: 'award',
    title: 'Acompanhar pontos',
    description: 'Veja o saldo de pontos que cada cliente acumulou.',
  },
  {
    icon: 'user',
    title: 'Abrir a ficha do cliente',
    description: 'Dados de contato e pedidos reunidos em um só lugar.',
  },
] as const
