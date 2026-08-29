import { TableTabDetailContent } from '@pages/TableTabDetail/components/TableTabDetailContent/TableTabDetailContent'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

export const TableTabDetail = () => {
  const domain = useTableTabDetailFacade()

  return <TableTabDetailContent {...domain} />
}
