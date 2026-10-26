import { useEffect, useRef } from 'react'

type CountUpProps = {
  /** Valor a exibir. Mudou, o número corre até ele */
  value: number
}

const DEFAULT_DURATION_MS = 460

const finiteValue = (value: number): number =>
  Number.isFinite(value) ? value : 0

const durationInMilliseconds = (node: HTMLElement): number => {
  const raw = getComputedStyle(node)
    .getPropertyValue('--duration-slower')
    .trim()
  const amount = Number.parseFloat(raw)

  if (!Number.isFinite(amount) || amount <= 0) return DEFAULT_DURATION_MS
  return raw.endsWith('s') && !raw.endsWith('ms') ? amount * 1000 : amount
}

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeOutCubic = (progress: number): number => 1 - (1 - progress) ** 3

/**
 * Número que corre até o valor novo em vez de trocar de uma vez — a fila que
 * ganha um pedido, o caixa que sobe.
 *
 * Escreve direto no nó de texto, sem estado de React: um contador que
 * renderizasse a cada quadro custaria sessenta renders por segundo, e numa
 * tela de resumo há meia dúzia deles ao mesmo tempo.
 *
 */
export function CountUp({ value }: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const target = finiteValue(value)
  /* Onde o número está agora, não de onde a última animação partiu: é isto
   * que faz a corrida continuar de onde estava quando o valor muda no meio
   * do caminho, em vez de saltar de volta para o início. */
  const shownRef = useRef(target)
  const frameRef = useRef(0)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const from = shownRef.current
    if (from === target || prefersReducedMotion()) {
      shownRef.current = target
      node.textContent = String(target)
      return
    }

    const start = performance.now()
    const duration = durationInMilliseconds(node)

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const current = Math.round(
        from + (target - from) * easeOutCubic(progress)
      )
      shownRef.current = current
      node.textContent = String(current)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target])

  /* O valor inicial vai no HTML: sem ele o número aparece vazio até o
   * primeiro quadro, e some por completo quando não há JavaScript. */
  return <span ref={nodeRef}>{target}</span>
}
