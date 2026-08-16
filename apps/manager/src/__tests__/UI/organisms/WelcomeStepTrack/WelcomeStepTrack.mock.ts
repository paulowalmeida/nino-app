import type { WelcomePanel } from '@constants/welcome.constants'

export const twoStepPanels: WelcomePanel[] = [
  {
    leg: 'Balcão',
    stage: 'Primeira parada',
    title: 'Título 1',
    text: 'Texto 1',
    screen: 'Pedidos',
    demoKey: 'order-ticket',
  },
  {
    leg: 'Cozinha',
    stage: 'Segunda parada',
    title: 'Título 2',
    text: 'Texto 2',
    screen: 'Cozinha',
    demoKey: 'kitchen-card',
  },
]
