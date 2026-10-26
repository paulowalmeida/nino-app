const NOBODY_YET =
  'Ninguém por aqui ainda. Quem fizer o primeiro pedido pelo app ' +
  'aparece nesta lista.'

export const consumersEmptyMessage = (search: string): string =>
  search
    ? `Nenhum cliente com "${search}". Tente outro nome ou telefone.`
    : NOBODY_YET
