export type UserMenuProps = {
  name: string
  tenantId: string | null
  onNavigate?: () => void
  collapsed?: boolean
}
