export type Elapsed = {
  label: string
  isLate: boolean
  /** Quanto da paciência já foi gasta, de 0 a 1 — trava em 1 no atraso. */
  ratio: number
  /**
   * Quanto do atraso já correu, de 0 a 1. Zero enquanto está no prazo, e
   * separa o pedido que acabou de estourar do que estourou faz uma hora.
   */
  overdueRatio: number
}
