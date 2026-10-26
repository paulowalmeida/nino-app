type FunctionalitySearchItem = {
  section: string
  label: string
  group: string
  target?: string
}

export const FUNCTIONALITY_SEARCH_ITEMS: FunctionalitySearchItem[] = [
  {
    section: 'unidade/informacoes',
    label: 'Dados da unidade',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/informacoes',
    label: 'Nome da unidade',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/informacoes',
    label: 'Link da loja',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/informacoes',
    label: 'Endereço da unidade',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/informacoes',
    label: 'Cidades atendidas',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/informacoes',
    label: 'Aba Atendimento da unidade',
    group: 'Unidade · Informações',
  },
  {
    section: 'unidade/horarios',
    label: 'Horários de funcionamento',
    group: 'Unidade · Horários',
  },
  {
    section: 'unidade/horarios',
    label: 'Dias e horários de abertura',
    group: 'Unidade · Horários',
  },
  {
    section: 'unidade/pagamento',
    label: 'Oferecer cashback',
    group: 'Unidade · Pagamento',
  },
  {
    section: 'unidade/pagamento',
    label: 'Percentual de cashback',
    group: 'Unidade · Pagamento',
  },
  {
    section: 'unidade/pagamento',
    label: 'Saldo mínimo para usar cashback',
    group: 'Unidade · Pagamento',
  },
  {
    section: 'unidade/atendimento',
    label: 'Regras de atendimento',
    group: 'Unidade · Atendimento',
  },
  {
    section: 'unidade/entrega',
    label: 'Zonas e raios de entrega',
    group: 'Unidade · Entrega',
  },
  {
    section: 'unidade/pagamento',
    label: 'Formas de pagamento aceitas',
    group: 'Unidade · Pagamento',
    target: 'unidade/pagamento#formas-de-pagamento',
  },
  {
    section: 'unidade/pagamento',
    label: 'Pedir CPF na nota',
    group: 'Unidade · Pagamento',
    target: 'unidade/pagamento#pedir-cpf-na-nota',
  },
  {
    section: 'unidade/pagamento',
    label: 'Pedido mínimo',
    group: 'Unidade · Pagamento',
    target: 'unidade/pagamento#pedido-minimo',
  },
  {
    section: 'unidade/atendimento',
    label: 'Exibir endereço nos detalhes da loja',
    group: 'Unidade · Atendimento',
  },
  {
    section: 'unidade/atendimento',
    label: 'Pedido sem cadastro',
    group: 'Unidade · Atendimento',
  },
  {
    section: 'unidade/atendimento',
    label: 'Tempo de preparo',
    group: 'Unidade · Atendimento',
  },
  {
    section: 'unidade/atendimento',
    label: 'Tempo de entrega',
    group: 'Unidade · Atendimento',
  },
  {
    section: 'unidade/entrega',
    label: 'Áreas de entrega',
    group: 'Unidade · Entrega',
  },
  {
    section: 'unidade/entrega',
    label: 'Raio da faixa de entrega',
    group: 'Unidade · Entrega',
  },
  {
    section: 'unidade/entrega',
    label: 'Taxa de entrega',
    group: 'Unidade · Entrega',
  },
  {
    section: 'unidade/entrega',
    label: 'Mapa das áreas de entrega',
    group: 'Unidade · Entrega',
  },
  {
    section: 'unidade/salao-comandas',
    label: 'Mesas e QR Codes',
    group: 'Unidade · Salão e comandas',
  },
  {
    section: 'unidade/salao-comandas',
    label: 'Comandas físicas',
    group: 'Unidade · Salão e comandas',
  },
  {
    section: 'unidade/salao-comandas',
    label: 'Quantidade de mesas',
    group: 'Unidade · Salão e comandas',
  },
  {
    section: 'unidade/salao-comandas',
    label: 'Prefixo das mesas',
    group: 'Unidade · Salão e comandas',
  },
  {
    section: 'unidade/contato',
    label: 'Telefones da unidade',
    group: 'Unidade · Contato',
  },
  {
    section: 'unidade/contato',
    label: 'Adicionar telefone',
    group: 'Unidade · Contato',
  },
  {
    section: 'empresa/informacoes',
    label: 'Dados da empresa',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/informacoes',
    label: 'CNPJ da empresa',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/informacoes',
    label: 'Nome da empresa',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/informacoes',
    label: 'Razão social',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/informacoes',
    label: 'Inscrição estadual',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/informacoes',
    label: 'Endereço da empresa',
    group: 'Empresa · Informações',
  },
  {
    section: 'empresa/unidades',
    label: 'Lojas da empresa',
    group: 'Empresa · Unidades',
  },
  {
    section: 'empresa/unidades',
    label: 'Abrir unidade',
    group: 'Empresa · Unidades',
    target: 'empresa/unidades/nova',
  },
  {
    section: 'empresa/unidades',
    label: 'Unidade matriz',
    group: 'Empresa · Unidades',
  },
  {
    section: 'empresa/personalizar',
    label: 'Ponto de partida da loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Cores da loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Logo e banner',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Blocos da home',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Estilo do cardápio',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Proporção da foto do cardápio',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Mostrar descrição dos produtos',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Carregamento da loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Acompanhamento do pedido',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Mensagem de espera',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Versões publicadas da loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Prévia no celular',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Prévia no computador',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Salvar rascunho da loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'empresa/personalizar',
    label: 'Publicar na loja',
    group: 'Empresa · Personalizar',
  },
  {
    section: 'visao-geral',
    label: 'Fechar a loja por um tempo',
    group: 'Visão geral · Controle da loja',
    target: 'visao-geral#controle-da-loja',
  },
  {
    section: 'visao-geral',
    label: 'Reabrir a loja',
    group: 'Visão geral · Controle da loja',
    target: 'visao-geral#controle-da-loja',
  },
  {
    section: 'visao-geral',
    label: 'Fila de pedidos',
    group: 'Visão geral · Agora na loja',
    target: 'visao-geral#fila-de-pedidos',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos esperando aceite',
    group: 'Visão geral · Agora na loja',
    target: 'pedidos?etapa=incoming',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos confirmados',
    group: 'Visão geral · Agora na loja',
    target: 'pedidos?etapa=confirmed',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos na cozinha',
    group: 'Visão geral · Agora na loja',
    target: 'pedidos?etapa=kitchen',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos que saíram para entrega',
    group: 'Visão geral · Agora na loja',
    target: 'pedidos?etapa=street',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos prontos para retirada',
    group: 'Visão geral · Agora na loja',
    target: 'pedidos?etapa=counter',
  },
  {
    section: 'visao-geral',
    label: 'Faturamento dos últimos 7 dias',
    group: 'Visão geral · Vendas',
    target: 'visao-geral#faturamento-ultimos-7-dias',
  },
  {
    section: 'visao-geral',
    label: 'Variação do faturamento',
    group: 'Visão geral · Vendas',
    target: 'visao-geral#faturamento-ultimos-7-dias',
  },
  {
    section: 'visao-geral',
    label: 'Últimos vendidos',
    group: 'Visão geral · O que mais sai',
    target: 'visao-geral#ultimos-vendidos',
  },
  {
    section: 'visao-geral',
    label: 'Quem mais gasta',
    group: 'Visão geral · Clientes',
    target: 'visao-geral#quem-mais-gasta',
  },
  {
    section: 'visao-geral',
    label: 'Quem mais pede',
    group: 'Visão geral · Clientes',
    target: 'visao-geral#quem-mais-pede',
  },
  {
    section: 'visao-geral',
    label: 'Resumo do dia',
    group: 'Visão geral · O dia até agora',
    target: 'visao-geral#resumo-do-dia',
  },
  {
    section: 'visao-geral',
    label: 'Pedidos fechados hoje',
    group: 'Visão geral · O dia até agora',
    target: 'pedidos?etapa=closed',
  },
  {
    section: 'visao-geral',
    label: 'Faturamento de hoje',
    group: 'Visão geral · O dia até agora',
    target: 'relatorios?periodo=today',
  },
  {
    section: 'visao-geral',
    label: 'Ticket médio de hoje',
    group: 'Visão geral · O dia até agora',
    target: 'relatorios?periodo=today',
  },
  {
    section: 'visao-geral',
    label: 'Vendas por forma de pagamento hoje',
    group: 'Visão geral · O dia até agora',
    target: 'visao-geral#pagamentos-hoje',
  },
  {
    section: 'visao-geral',
    label: 'Últimos pedidos',
    group: 'Visão geral · O dia até agora',
    target: 'visao-geral#ultimos-pedidos',
  },
  {
    section: 'relatorios',
    label: 'Período do relatório',
    group: 'Negócio · Relatórios',
  },
  {
    section: 'relatorios',
    label: 'Período personalizado',
    group: 'Negócio · Relatórios',
  },
  {
    section: 'relatorios',
    label: 'Produtos mais vendidos',
    group: 'Negócio · Relatórios',
    target: 'relatorios#mais-vendidos',
  },
  {
    section: 'relatorios',
    label: 'Faturamento por canal',
    group: 'Negócio · Relatórios',
  },
  {
    section: 'relatorios',
    label: 'Faturamento por forma de pagamento',
    group: 'Negócio · Relatórios',
  },
  {
    section: 'clientes',
    label: 'Buscar clientes',
    group: 'Negócio · Clientes',
  },
  {
    section: 'clientes',
    label: 'Pedidos do cliente',
    group: 'Negócio · Clientes',
  },
  {
    section: 'clientes',
    label: 'Endereços do cliente',
    group: 'Negócio · Clientes',
  },
  {
    section: 'colaboradores',
    label: 'Convidar colaborador',
    group: 'Negócio · Colaboradores',
    target: 'colaboradores?acao=convidar',
  },
  {
    section: 'colaboradores',
    label: 'Equipe do painel',
    group: 'Negócio · Colaboradores',
    target: 'colaboradores?tab=staff#equipe-do-painel',
  },
  {
    section: 'colaboradores',
    label: 'Buscar quem está no painel',
    group: 'Negócio · Colaboradores',
    target: 'colaboradores?tab=staff#equipe-do-painel',
  },
  {
    section: 'comandas',
    label: 'Buscar comandas',
    group: 'Operação · Comandas',
  },
  {
    section: 'pedidos',
    label: 'Buscar pedidos',
    group: 'Operação · Pedidos',
  },
  {
    section: 'caixa',
    label: 'Fechar caixa',
    group: 'Operação · Caixa',
    target: 'caixa?acao=fechar-caixa',
  },
  {
    section: 'caixa',
    label: 'Movimentação de caixa',
    group: 'Operação · Caixa',
  },
  {
    section: 'cozinha',
    label: 'Fila de pedidos da cozinha',
    group: 'Operação · Cozinha',
  },
  {
    section: 'produtos',
    label: 'Buscar produtos no cardápio',
    group: 'Cardápio · Produtos',
  },
  {
    section: 'produtos',
    label: 'Cadastrar produto',
    group: 'Cardápio · Produtos',
    target: 'produtos/novo',
  },
  {
    section: 'categorias-produtos',
    label: 'Organizar categorias do cardápio',
    group: 'Cardápio · Categorias',
  },
  {
    section: 'balcao',
    label: 'Venda no balcão',
    group: 'Operação · Balcão',
  },
  {
    section: 'balcao',
    label: 'Buscar item no cardápio do balcão',
    group: 'Operação · Balcão',
  },
  {
    section: 'balcao',
    label: 'Pedido com entrega pelo balcão',
    group: 'Operação · Balcão',
  },
  {
    section: 'balcao',
    label: 'Calcular troco',
    group: 'Operação · Balcão',
  },
  {
    section: 'comandas',
    label: 'Abrir comanda',
    group: 'Operação · Comandas',
    target: 'comandas?acao=abrir-comanda',
  },
  {
    section: 'comandas',
    label: 'Comanda sem mesa',
    group: 'Operação · Comandas',
  },
  {
    section: 'comandas',
    label: 'Comandas finalizadas',
    group: 'Operação · Comandas',
  },
  {
    section: 'pedidos',
    label: 'Lançar pedido manual',
    group: 'Operação · Pedidos',
    target: 'pedidos/novo',
  },
  {
    section: 'pedidos',
    label: 'Buscar pedido por código, nome ou telefone',
    group: 'Operação · Pedidos',
  },
  {
    section: 'pedidos',
    label: 'Etapas da fila de pedidos',
    group: 'Operação · Pedidos',
  },
  {
    section: 'caixa',
    label: 'Abrir o caixa',
    group: 'Operação · Caixa',
  },
  {
    section: 'caixa',
    label: 'Fundo de troco',
    group: 'Operação · Caixa',
  },
  {
    section: 'caixa',
    label: 'Sangria',
    group: 'Operação · Caixa',
    target: 'caixa?acao=sangria',
  },
  {
    section: 'caixa',
    label: 'Suprimento',
    group: 'Operação · Caixa',
    target: 'caixa?acao=suprimento',
  },
  {
    section: 'caixa',
    label: 'Caixa de outro dia',
    group: 'Operação · Caixa',
  },
  {
    section: 'produtos',
    label: 'Novo item no cardápio',
    group: 'Cardápio · Produtos',
    target: 'produtos/novo',
  },
  {
    section: 'produtos',
    label: 'Desligar item que acabou',
    group: 'Cardápio · Produtos',
  },
  {
    section: 'produtos',
    label: 'Filtrar produtos por categoria',
    group: 'Cardápio · Produtos',
  },
  {
    section: 'categorias-produtos',
    label: 'Nova categoria',
    group: 'Cardápio · Categorias',
    target: 'categorias-produtos?acao=nova-categoria',
  },
  {
    section: 'categorias-produtos',
    label: 'Ícone da categoria',
    group: 'Cardápio · Categorias',
  },
  {
    section: 'categorias-produtos',
    label: 'Ordem das categorias no app',
    group: 'Cardápio · Categorias',
  },
  {
    section: 'colaboradores',
    label: 'Colaboradores inativos',
    group: 'Negócio · Colaboradores',
    target: 'colaboradores?tab=inactive',
  },
  {
    section: 'colaboradores',
    label: 'Suspender colaborador',
    group: 'Negócio · Colaboradores',
  },
  {
    section: 'colaboradores',
    label: 'Mudar cargo de um colaborador',
    group: 'Negócio · Colaboradores',
  },
  {
    section: 'cargos',
    label: 'Cargos e permissões',
    group: 'Negócio · Cargos',
  },
  {
    section: 'cargos',
    label: 'Novo cargo',
    group: 'Negócio · Cargos',
    target: 'cargos/novo',
  },
  {
    section: 'cargos',
    label: 'Duplicar cargo',
    group: 'Negócio · Cargos',
  },
  {
    section: 'cargos',
    label: 'Hierarquia dos cargos',
    group: 'Negócio · Cargos',
  },
  {
    section: 'promocoes',
    label: 'Promoções cadastradas',
    group: 'Unidade · Promoções',
  },
  {
    section: 'promocoes',
    label: 'Cupom de desconto',
    group: 'Unidade · Promoções',
  },
  {
    section: 'promocoes',
    label: 'Promoção com pedido mínimo',
    group: 'Unidade · Promoções',
  },
  {
    section: 'promocoes',
    label: 'Período da promoção',
    group: 'Unidade · Promoções',
  },
]
