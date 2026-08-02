export type StorePreviewProps = {
  /** Nome digitado. Vazio mantém a placa apagada, com o texto de exemplo. */
  name: string
  /** Texto de exemplo enquanto ninguém digitou. */
  placeholder?: string
  /** Slug de exemplo, mostrado junto do domínio enquanto está apagado. */
  placeholderSlug?: string
}
