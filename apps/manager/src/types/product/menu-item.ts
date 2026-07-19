export type MenuItemImage = {
  id: string
  url: string
  isPrimary: boolean
}

export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  position: number
  isActive: boolean
  category: {
    id: string
    name: string
  }
  images: MenuItemImage[]
}
