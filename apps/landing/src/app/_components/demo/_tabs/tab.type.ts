import { JSX } from "react"

export type DemoTab = {
  id: string
  label: string
  Component: () => JSX.Element
}
