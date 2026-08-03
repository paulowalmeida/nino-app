import badgeIcon from '@assets/icons/badge.svg?raw'
import bagIcon from '@assets/icons/bag.svg?raw'
import buildingIcon from '@assets/icons/building.svg?raw'
import cardIcon from '@assets/icons/credit-card.svg?raw'
import chartIcon from '@assets/icons/bar-chart.svg?raw'
import checkIcon from '@assets/icons/check.svg?raw'
import chefIcon from '@assets/icons/chef-hat.svg?raw'
import chevronIcon from '@assets/icons/chevron-down.svg?raw'
import clockIcon from '@assets/icons/clock.svg?raw'
import bookIcon from '@assets/icons/book.svg?raw'
import gaugeIcon from '@assets/icons/gauge.svg?raw'
import settingsIcon from '@assets/icons/settings.svg?raw'
import gridIcon from '@assets/icons/grid.svg?raw'
import logoutIcon from '@assets/icons/logout.svg?raw'
import menuIcon from '@assets/icons/menu.svg?raw'
import phoneIcon from '@assets/icons/phone.svg?raw'
import pinIcon from '@assets/icons/pin.svg?raw'
import receiptIcon from '@assets/icons/receipt.svg?raw'
import registerIcon from '@assets/icons/cash-register.svg?raw'
import storeIcon from '@assets/icons/store.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'
import usersIcon from '@assets/icons/users.svg?raw'

import type { NavIconName, NavIconProps } from './NavIcon.types'

import styles from './NavIcon.module.css'

const ICONS: Record<NavIconName, string> = {
  grid: gridIcon,
  bag: bagIcon,
  users: usersIcon,
  settings: settingsIcon,
  gauge: gaugeIcon,
  chart: chartIcon,
  book: bookIcon,
  chef: chefIcon,
  register: registerIcon,
  badge: badgeIcon,
  building: buildingIcon,
  card: cardIcon,
  clock: clockIcon,
  pin: pinIcon,
  phone: phoneIcon,
  user: userIcon,
  receipt: receiptIcon,
  logout: logoutIcon,
  menu: menuIcon,
  store: storeIcon,
  check: checkIcon,
  chevron: chevronIcon,
}

/**
 * `svg` comes from a build-time `?raw` import — trusted markup, not user
 * input, so `dangerouslySetInnerHTML` is safe here.
 */
export const NavIcon = ({ name, className }: NavIconProps) => (
  <span
    className={className ? `${styles.icon} ${className}` : styles.icon}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: ICONS[name] }}
  />
)
