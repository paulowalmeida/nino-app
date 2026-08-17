/**
 * De onde a pessoa chegou numa tela de detalhe. Viaja no `state` da
 * navegação porque a URL do detalhe é a mesma venha ela de onde vier — o
 * pedido aberto pela ficha do cliente e pela fila de pedidos é o mesmo
 * endereço, e só quem navegou sabe pra onde o voltar deve devolver.
 */
export type BackTarget = {
  /** Rota de retorno, absoluta */
  to: string
  /** Nome do lugar de origem, como ele aparece no botão de voltar */
  label: string
}
