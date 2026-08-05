import type { InfiniteData } from '@tanstack/react-query'

import type { MenuPage } from '@custom_types/product/menu-page'
export const twoItemPage: InfiniteData<MenuPage> = {
  pageParams: [1],
  pages: [
    {
      data: [
        { id: 'a', position: 1 } as MenuPage['data'][number],
        { id: 'b', position: 2 } as MenuPage['data'][number],
      ],
      pagination: { total: 2 },
    },
  ],
}
