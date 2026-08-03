export type NavIconName =
  | 'grid'
  | 'gauge'
  | 'chart'
  | 'bag'
  | 'book'
  | 'chef'
  | 'register'
  | 'users'
  | 'badge'
  | 'building'
  | 'card'
  | 'clock'
  | 'pin'
  | 'phone'
  | 'user'
  | 'receipt'
  | 'settings'
  | 'logout'
  | 'menu'
  | 'store'
  | 'check'
  | 'chevron'

export type NavIconProps = {
  name: NavIconName
  className?: string
}
