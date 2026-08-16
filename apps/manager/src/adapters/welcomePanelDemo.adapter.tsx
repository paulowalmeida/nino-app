import { KitchenCard } from '@organisms/KitchenCard/KitchenCard'
import { OrderTicket } from '@organisms/OrderTicket/OrderTicket'
import { OrderTimeline } from '@organisms/OrderTimeline/OrderTimeline'
import type { WelcomePanelDemoKey } from '@constants/welcome.constants'

import { demoOrder, demoTimeline } from '@utils/welcome-demo-order'

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
