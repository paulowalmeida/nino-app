export type SectionLink = {
  /** Segmento da rota filha, relativo à tela. */
  to: string
  label: string
  /** O que se resolve ali dentro, em uma linha. */
  hint: string
}

export type SectionNavProps = {
  sections: SectionLink[]
  ariaLabel: string
}
