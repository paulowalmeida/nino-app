export type SidebarProps = {
  tenantId: string | null
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}
