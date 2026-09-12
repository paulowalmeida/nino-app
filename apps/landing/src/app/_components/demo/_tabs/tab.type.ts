import { JSX } from "react"

export type DemoTab = {
  id: string
  label: string
  side: "consumer" | "owner"
  caption: string
  Component: () => JSX.Element
}
