import { awaitingPaymentTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

export const tabPaymentFormMock = {
  tab: awaitingPaymentTabMock,
  cashLabel: 'Dinheiro',
  pixLabel: 'Pix',
  amountLabel: 'Valor deste pagamento',
  receivedLabel: 'Valor recebido',
  halfSplitName: /Dividir o que falta por 2: R\$\s18,00/,
}
