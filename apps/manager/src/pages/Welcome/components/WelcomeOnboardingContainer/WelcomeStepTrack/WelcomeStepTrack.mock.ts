import type { WelcomePanel } from '@pages/Welcome/types/WelcomePanel.type'

export const welcomeStepTrackPanelsMock: WelcomePanel[] = [
  {
    leg: 'Balcão',
    stage: 'Primeira parada',
    title: 'O pedido cai no balcão',
    text: 'texto',
    screen: 'Pedidos',
    demoKey: 'order-ticket',
  },
  {
    leg: 'Cozinha',
    stage: 'Segunda parada',
    title: 'A cozinha já sabe',
    text: 'texto',
    screen: 'Cozinha',
    demoKey: 'kitchen-card',
  },
]
