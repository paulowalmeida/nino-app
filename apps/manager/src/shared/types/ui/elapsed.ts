export type Elapsed = {
  label: string
  isLate: boolean
  /** Quanto da paciência já foi gasta, de 0 a 1 — trava em 1 no atraso. */
  ratio: number
}
