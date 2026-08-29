import { TableTabDetailContent } from '@pages/TableTabDetail/components/TableTabDetailContent/TableTabDetailContent'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

export const TableTabDetail = () => {
  const domain = useTableTabsFacade()

  return <TableTabDetailContent {...domain} />
}
