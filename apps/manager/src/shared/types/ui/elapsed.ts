import type { ElapsedPace } from './elapsed-pace'

export type Elapsed = {
  label: string
  /** Quanto falta do prazo, na mesma linguagem: `6 min`, `-12 min`. */
  remaining: string
  isLate: boolean
  /** Em que trecho do prazo o pedido está — a cor da régua sai daqui. */
  pace: ElapsedPace
  /** Quanto da paciência já foi gasta, de 0 a 1 — trava em 1 no atraso. */
  ratio: number
  /**
   * Quanto do atraso já correu, de 0 a 1. Zero enquanto está no prazo, e
   * separa o pedido que acabou de estourar do que estourou faz uma hora.
   */
  overdueRatio: number
}
