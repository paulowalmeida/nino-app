/* WHY: CEP sozinho não cota; vai o ponto escolhido no Google ou o endereço
 * completo, que a API geocodifica no Google. */
export type DeliveryQuoteDestination =
  | { latitude: number; longitude: number }
  | {
      zipCode: string
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
    }
