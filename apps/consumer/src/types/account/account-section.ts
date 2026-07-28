/** Uma gaveta da conta. `soon` marca o que ainda não tem servidor por trás. */
export type AccountSection = {
  to: string
  label: string
  icon: string
  soon?: boolean
}
