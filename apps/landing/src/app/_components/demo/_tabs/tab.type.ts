import { JSX } from "react"

export type DemoTab = {
  id: string
  label: string
  side: "customer" | "owner"
  caption: string
  Component: () => JSX.Element
}
