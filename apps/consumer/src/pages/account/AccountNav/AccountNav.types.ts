export type AccountNavProps = {
  base: string
  counts: Record<string, number | undefined>
  onLogout: () => void
  isLoggingOut: boolean
}
