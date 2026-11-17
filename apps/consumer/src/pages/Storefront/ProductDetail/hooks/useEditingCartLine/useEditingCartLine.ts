import { useSearchParams } from 'react-router'

import type { CartLine } from '@custom_types/cart/cart-line'
import { useCartStore } from '@shared/states/cart/cart.state'

export const EDITING_LINE_PARAM = 'linha'

/**
 * A linha da sacola que a modal está editando, vinda de `?linha=`. Linha de
 * pacote/promoção não se edita por aqui (preço fechado, itens do pacote), e
 * linha que sumiu ou é de outro produto cai de volta no modo "adicionar".
 */
export const useEditingCartLine = (
  productId: string | undefined
): CartLine | null => {
  const [params] = useSearchParams()
  const lineId = params.get(EDITING_LINE_PARAM)
  const line = useCartStore((state) => (lineId ? state.lines[lineId] : null))

  if (!line || line.item.package || line.item.id !== productId) return null
  return line
}
