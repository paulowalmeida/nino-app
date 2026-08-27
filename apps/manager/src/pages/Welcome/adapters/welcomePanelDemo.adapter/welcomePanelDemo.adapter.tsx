import type { WelcomePanelDemoKey } from '@pages/Welcome/types/WelcomePanelDemoKey.type'
import { demoOrder, demoTimeline } from '@pages/Welcome/utils/welcomeDemoOrder/welcomeDemoOrder'
import { KitchenCard } from '@shared/components/KitchenCard/KitchenCard'
import { OrderTicket } from '@shared/components/OrderTicket/OrderTicket'
import { OrderTimeline } from '@shared/components/OrderTimeline/OrderTimeline'

const noop = () => {}

/**
 * Maps a panel's `demoKey` to the real component it demonstrates, fed with a
 * fake order — the only place `WELCOME_PANELS`' data becomes JSX, since a
 * constants file can't hold markup.
 */
export const welcomePanelDemo = (key: WelcomePanelDemoKey) => {
  switch (key) {
    case 'order-ticket':
      return (
        <OrderTicket
          order={demoOrder('PENDING', 2)}
          onAdvance={noop}
          isBusy={false}
        />
      )
    case 'kitchen-card':
      return (
        <KitchenCard
          order={demoOrder('PREPARING', 6)}
          onAdvance={noop}
          isBusy={false}
        />
      )
    case 'order-timeline':
      return <OrderTimeline entries={demoTimeline()} />
  }
}
