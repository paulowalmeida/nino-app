import { useEffect } from 'react'

type CounterShortcutsParams = {
  isOpen: boolean
  canAdvance: boolean
  onAdvance: () => void
  onClose: () => void
}

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/**
 * Enter avança o pedido e Esc fecha, enquanto o cupom está aberto. O balcão
 * fecha venda com as duas mãos ocupadas: quem já sabe a sequência não devia
 * precisar mirar o botão a cada passo.
 */
export const useCounterShortcuts = ({
  isOpen,
  canAdvance,
  onAdvance,
  onClose,
}: CounterShortcutsParams) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Enter' || isTyping(event.target)) return
      if (!canAdvance) return

      event.preventDefault()
      onAdvance()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, canAdvance, onAdvance, onClose])
}
