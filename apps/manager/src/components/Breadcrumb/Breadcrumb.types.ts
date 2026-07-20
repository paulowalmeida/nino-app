export type Crumb = {
  label: string
  /** Sem `to`, é a página atual — o último degrau não é link. */
  to?: string
}

export type BreadcrumbProps = {
  trail: Crumb[]
}
