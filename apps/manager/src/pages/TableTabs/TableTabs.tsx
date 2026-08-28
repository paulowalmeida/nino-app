import { TableTabsList } from '@pages/TableTabs/components/TableTabsList/TableTabsList'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

export const TableTabs = () => {
  const domain = useTableTabsFacade()

  return <TableTabsList {...domain} />
}
