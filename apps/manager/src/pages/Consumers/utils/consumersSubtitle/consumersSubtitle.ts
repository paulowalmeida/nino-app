const NO_TOTAL = 'Quem pede pelo app entra nesta lista.'

export const consumersSubtitle = (total: number | undefined): string =>
  total === undefined
    ? NO_TOTAL
    : `${total} ${total === 1 ? 'pessoa' : 'pessoas'} com pedido nesta ` +
      'loja. Abra alguém para ver o histórico.'
