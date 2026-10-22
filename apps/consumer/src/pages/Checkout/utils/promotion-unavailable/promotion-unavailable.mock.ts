export const promotionUnavailableBodyMock = {
  statusCode: 409,
  code: 'PROMOTION_UNAVAILABLE',
  message: 'A promoção acabou. Confira o novo valor antes de confirmar.',
  deliveryFee: 7,
}

export const idempotencyConflictBodyMock = {
  statusCode: 409,
  message: 'A chave de idempotência já foi usada para outra solicitação.',
}
