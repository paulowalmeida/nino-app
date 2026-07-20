export type NavIconName =
  | 'grid'
  | 'gauge'
  | 'bag'
  | 'clipboard'
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
  | 'gear'
  | 'logout'
  | 'menu'
  | 'store'
  | 'check'
  | 'chevron'

export type NavIconProps = {
  name: NavIconName
  className?: string
}
