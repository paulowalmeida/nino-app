import type { FC } from "react"

import { IconProps } from "./_icons"

export type NavItemDef = {
  href: string
  label: string
  icon: FC<IconProps>
}
