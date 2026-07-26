import '@tanstack/react-query'

/**
 * Declares what a mutation can ask the global feedback handler in
 * `services/query-client.ts` to say. `interface` here is not a style slip:
 * react-query only picks up the augmentation through declaration merging,
 * which a `type` alias cannot do.
 */
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Toast shown when the mutation succeeds. Omit to stay silent. */
      success?: string
      /** Overrides the generic failure title. */
      errorTitle?: string
      /** Set when the screen already shows the error next to the field. */
      silentError?: true
    }
  }
}
