/**
 * A saudação do relógio de quem está lendo — não o da loja.
 *
 * A loja tem `timezone` próprio e ele governa horário de funcionamento, mas
 * "boa noite" é sobre a pessoa: quem pede de outro fuso está de fato à noite,
 * e ler "bom dia" às 22h faz a tela parecer de outra pessoa.
 */
export const greeting = (now: Date = new Date()): string => {
  const hour = now.getHours()

  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

/**
 * O primeiro nome, que é como a casa chama o freguês. Conta aberta por
 * telefone ainda não tem nome — nesses casos a saudação fica sozinha, sem o
 * número cru no lugar de um nome.
 */
export const firstName = (name?: string | null): string | null => {
  const first = name?.trim().split(/\s+/)[0]
  return first || null
}
