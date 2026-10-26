import type { ManagerNotification } from '@shared/types/notification/manager-notification.type'

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString()

/* WHY: a nino-api ainda não tem notificação de gestor. Estes dados seguram
 * o sino e a tela até o endpoint existir; troca-se só o store. */
export const PLACEHOLDER_NOTIFICATIONS: ManagerNotification[] = [
  {
    id: 'ntf-1',
    kind: 'order',
    title: 'Pedido #1042 chegou',
    description: 'Delivery · 3 itens · R$ 86,40',
    createdAt: minutesAgo(2),
    readAt: null,
    path: 'pedidos',
  },
  {
    id: 'ntf-2',
    kind: 'order',
    title: 'Pedido #1039 cancelado pelo cliente',
    description: 'Retirada · cancelado antes do preparo',
    createdAt: minutesAgo(18),
    readAt: null,
    path: 'pedidos',
  },
  {
    id: 'ntf-3',
    kind: 'cash',
    title: 'Caixa fechado com diferença',
    description: 'Sobra de R$ 12,50 no fechamento do turno da noite',
    createdAt: minutesAgo(60 * 15),
    readAt: null,
    path: 'caixa',
  },
  {
    id: 'ntf-4',
    kind: 'team',
    title: 'Ana Souza aceitou o convite',
    description: 'Entrou na equipe como Atendente',
    createdAt: minutesAgo(60 * 26),
    readAt: minutesAgo(60 * 20),
    path: 'colaboradores',
  },
  {
    id: 'ntf-5',
    kind: 'promotion',
    title: 'Promoção Terça do Smash termina hoje',
    description: 'Ela sai do cardápio à meia-noite',
    createdAt: minutesAgo(60 * 30),
    readAt: minutesAgo(60 * 29),
    path: 'promocoes',
  },
  {
    id: 'ntf-6',
    kind: 'order',
    title: 'Pedido #1018 entregue',
    description: 'Delivery · entregue por Carlos em 24 min',
    createdAt: minutesAgo(60 * 50),
    readAt: minutesAgo(60 * 49),
    path: 'pedidos',
  },
]
