import type { User } from "@nino/lib"

export type SidebarProps = {
  user: User
  isOpen: boolean
  onClose: () => void
}
