import type { DiningTable } from '@shared/types/settings/dining-table'
import { openTabMock } from '@shared/utils/active-tab-items/active-tab-items.mock'

const tableTimestamps = {
  unitId: 'unit-1',
  createdAt: '2026-10-19T12:00:00.000Z',
  updatedAt: '2026-10-19T12:00:00.000Z',
}

const tables: DiningTable[] = [
  {
    ...tableTimestamps,
    id: 'table-4',
    name: 'Mesa 4',
    publicKey: 'key-4',
    isActive: true,
  },
  {
    ...tableTimestamps,
    id: 'table-5',
    name: 'Mesa 5',
    publicKey: 'key-5',
    isActive: true,
  },
  {
    ...tableTimestamps,
    id: 'table-6',
    name: 'Mesa 6',
    publicKey: 'key-6',
    isActive: false,
  },
]

export const diningTableSeatsMock = {
  tables,
  activeTabs: [
    openTabMock,
    { ...openTabMock, id: 'tab-bar', diningTableId: null, label: 'Seu João' },
  ],
}
