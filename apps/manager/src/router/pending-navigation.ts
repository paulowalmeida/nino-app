type NavigationLocation = {
  pathname: string
  search: string
  hash: string
}

const PENDING_NAVIGATION_KEY = 'nino-manager-pending-navigation'

const hrefOf = ({ pathname, search, hash }: NavigationLocation) =>
  `${pathname}${search}${hash}`

export const rememberPendingNavigation = (location: NavigationLocation) => {
  sessionStorage.setItem(PENDING_NAVIGATION_KEY, hrefOf(location))
}

export const readPendingNavigation = () =>
  sessionStorage.getItem(PENDING_NAVIGATION_KEY)

export const recoveryTarget = (currentHref: string) =>
  readPendingNavigation() ?? currentHref

export const clearCompletedNavigation = (location: NavigationLocation) => {
  if (readPendingNavigation() === hrefOf(location)) {
    sessionStorage.removeItem(PENDING_NAVIGATION_KEY)
  }
}
