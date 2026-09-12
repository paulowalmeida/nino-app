/**
 * O primeiro nome, que é como a casa chama o freguês. Conta aberta por
 * telefone ainda não tem nome — nesses casos a saudação fica sozinha, sem o
 * número cru no lugar de um nome.
 */
export const firstName = (name?: string | null): string | null => {
  const first = name?.trim().split(/\s+/)[0]
  return first || null
}

/**
 * As iniciais do freguês, do jeito que a loja tem as dela no azulejo da
 * vitrine: no máximo duas letras, primeira e última palavra do nome.
 */
export const consumerInitials = (name?: string | null): string | null => {
  const parts = name?.trim().split(/\s+/).filter(Boolean)
  if (!parts?.length) return null

  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''

  return `${first}${last}`.toUpperCase()
}
