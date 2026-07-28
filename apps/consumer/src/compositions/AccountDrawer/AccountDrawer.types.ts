export type AccountDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Prefixo de rota da loja: `/slug` no atalho local, vazio no subdomínio. */
  base: string
}
