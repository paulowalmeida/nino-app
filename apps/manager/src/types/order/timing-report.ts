/** Tempo médio (em minutos) de preparo e entrega num período. */
export type TimingReport = {
  averagePreparationMinutes: number
  averageDeliveryMinutes: number
  preparationSampleSize: number
  deliverySampleSize: number
}
