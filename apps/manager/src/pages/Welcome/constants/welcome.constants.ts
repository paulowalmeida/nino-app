import type { WelcomePanel } from '@pages/Welcome/types/WelcomePanel.type'

/**
 * Cada parada mostra o componente que a pessoa vai usar de verdade — a ficha do
 * pedido, a comanda da cozinha, a linha do tempo da entrega —, alimentado por
 * um pedido de mentira. Explicar o painel com desenho genérico seria vender
 * outra coisa; aqui o que aparece é o painel. `demoKey` só identifica qual
 * componente montar — o JSX em si mora no adapter, porque um arquivo de
 * constants é dado, não markup.
 */
export const WELCOME_PANELS: WelcomePanel[] = [
  {
    leg: 'Balcão',
    stage: 'Primeira parada',
    title: 'O pedido cai no balcão',
    text: 'Chega pelo link da sua loja e aparece na hora, com itens, endereço e o relógio correndo. Você aceita, recusa ou ajusta o tempo.',
    screen: 'Pedidos',
    demoKey: 'order-ticket',
  },
  {
    leg: 'Cozinha',
    stage: 'Segunda parada',
    title: 'A cozinha já sabe',
    text: 'A comanda abre no painel de parede assim que você aceita, com o número grande e o prazo escorrendo. Ninguém grita pedido nem imprime papel.',
    screen: 'Cozinha',
    demoKey: 'kitchen-card',
  },
  {
    leg: 'Entrega',
    stage: 'Última parada',
    title: 'Sai para entrega',
    text: 'Cada passo fica registrado com hora. O cliente acompanha pelo mesmo link, e no fim do dia o caixa fecha com o que entrou.',
    screen: 'Pedido #1042',
    demoKey: 'order-timeline',
  },
]
