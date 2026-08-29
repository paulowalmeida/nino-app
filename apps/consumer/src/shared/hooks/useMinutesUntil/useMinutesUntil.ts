import { useEffect, useReducer } from 'react'

const minutesFrom = (iso: string | null): number | null => {
  if (!iso) return null
  const diff = new Date(iso).getTime() - Date.now()
  return Number.isNaN(diff) ? null : Math.ceil(diff / 60_000)
}

/**
 * Minutos que faltam para um horário, recontados sozinhos. O status vem do
 * servidor a cada 10s, mas a previsão é uma conta de relógio: sem este tique
 * o número congela na tela de quem deixou o pedido aberto, e um contador
 * parado é pior que nenhum. O intervalo só força o render — o valor é
 * derivado na hora, então qualquer render (um refetch, por exemplo) já sai
 * com o número certo.
 */
export const useMinutesUntil = (iso: string | null): number | null => {
  const [, tick] = useReducer((n: number) => n + 1, 0)

  useEffect(() => {
    if (!iso) return

    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [iso])

  return minutesFrom(iso)
}
