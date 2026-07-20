export type NavIconName =
  | 'grid'
  | 'bag'
  | 'clipboard'
  | 'users'
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
