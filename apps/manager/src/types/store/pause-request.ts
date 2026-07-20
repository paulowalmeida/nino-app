/** Sem `minutes`, a loja fica fechada até alguém retomar. */
export type PauseRequest = {
  minutes?: number
  reason?: string
}
