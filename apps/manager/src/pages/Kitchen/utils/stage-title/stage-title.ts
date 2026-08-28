import { STATUS_LABEL } from '@shared/constants/order.constants'
import type { OrderStage } from '@shared/types/order/order-stage'
import { statusesForStage } from '@shared/utils/order-stage/order-stage'

/**
 * WHY: o trilho é lido com o mesmo nome que o pedido carrega nas outras
 * telas — derivar do STATUS_LABEL impede que os dois voltem a divergir.
 */
export const stageTitle = (stage: OrderStage): string =>
  STATUS_LABEL[statusesForStage(stage)[0]]
