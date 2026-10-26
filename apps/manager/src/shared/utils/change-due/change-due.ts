export type ChangeDue = {
  hasChange: boolean
  isValid: boolean
  amount: number
}

/*
 * WHY: nenhum valor recebido significa "pagou certo", não "campo em branco a
 * corrigir". Tratar os dois como o mesmo estado inválido é o que obriga o
 * atendente a digitar o total exato para conseguir fechar a venda.
 */
export const changeDue = (
  received: number | null,
  total: number
): ChangeDue => {
  if (received === null || !Number.isFinite(received)) {
    return { hasChange: false, isValid: received === null, amount: 0 }
  }

  const isValid = received >= total
  return { hasChange: true, isValid, amount: isValid ? received - total : 0 }
}
