export type CancelTabRequest = {
  cancelReason: string
  /** Só vai quando quem cancela não é gestor: libera um gestor na hora. */
  supervisorEmail?: string
  supervisorPassword?: string
}
