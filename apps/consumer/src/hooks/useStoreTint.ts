import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore'
import { resolveSlug } from '@utils/resolve-slug'

/**
 * A cor da loja para quem vive fora da árvore da página.
 *
 * A vitrine declara `--store-tint` no elemento da própria página, e tudo que
 * mora dentro dela herda. Gaveta e modal saem por um portal no `body`, fora
 * dessa árvore — lá a variável simplesmente não existe, e a peça cai no
 * laranja do nino sem ninguém notar. Este hook devolve a cor para que o
 * portal a declare de novo na sua raiz.
 *
 * A consulta é a mesma da vitrine e responde do cache; na tela da conta, que
 * não carrega a loja, é o único lugar que a busca.
 */
export const useStoreTint = (): string | undefined => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)

  return store?.primaryColor ?? undefined
}
