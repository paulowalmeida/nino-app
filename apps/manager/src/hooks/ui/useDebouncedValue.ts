import { useEffect, useState } from 'react'

/**
 * Segura o valor até a digitação parar. Sem isso, cada tecla no campo de
 * busca vira uma requisição — e a resposta da penúltima ainda pode chegar
 * depois da última e sobrescrever a lista com o resultado errado.
 */
export const useDebouncedValue = <T>(value: T, delay = 350): T => {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return settled
}
