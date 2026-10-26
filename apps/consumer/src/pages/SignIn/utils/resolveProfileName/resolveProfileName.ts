/**
 * O nome que veio do banco só vale a pena mostrar quando é um nome de
 * verdade. Conta aberta por telefone ou e-mail nasce com o próprio contato
 * no lugar do nome — mostrar `11999999999` num campo "Nome" pareceria erro
 * de sistema, não um valor a confirmar.
 */
export const resolveProfileName = (name: string): string => {
  const looksLikeEmail = name.includes('@')
  const looksLikePhone = /^\+?\d[\d\s()-]{6,}$/.test(name)

  return looksLikeEmail || looksLikePhone ? '' : name
}
