const irreversibleWarning =
  'O total será recalculado. Esta ação não pode ser desfeita.'

export const cancellationDescription = (itemCount: number, itemNames: string) =>
  `${itemCount} ${itemCount === 1 ? 'item será retirado' : 'itens serão retirados'} da comanda: ${itemNames}. ${irreversibleWarning}`
