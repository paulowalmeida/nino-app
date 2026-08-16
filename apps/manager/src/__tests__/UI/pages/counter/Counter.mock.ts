import type { Membership } from '@custom_types/auth/membership'
import type { MenuSection } from '@custom_types/product/menu-section'

export const currentTenant = { tenantId: 'tenant-1' } as Membership

const lanches = { id: 'cat-1', name: 'Lanches', position: 0 }

export const sections: MenuSection[] = [
  {
    id: 'cat-1',
    name: 'Lanches',
    position: 0,
    items: [
      {
        id: 'item-1',
        name: 'X-Salada',
        description: 'Com bacon',
        price: '18',
        position: 0,
        isActive: true,
        category: lanches,
        images: [],
      },
    ],
  },
]
