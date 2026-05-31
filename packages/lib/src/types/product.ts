import { PaginatedResponse, PaginatedQuery } from './common'

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  position: number | null
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductCategoryRequest {
  name: string
  description?: string
  position?: number
}

export interface UpdateProductCategoryRequest {
  name?: string
  description?: string
  position?: number
}

export type ProductCategoryPaginatedResponse =
  PaginatedResponse<ProductCategory>

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  position: number | null
  isActive: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string }
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  position?: number
  categoryId: string
  isActive?: boolean
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  position?: number
  categoryId?: string
  isActive?: boolean
}

export interface ProductQuery extends PaginatedQuery {
  categoryId?: string
  isActive?: boolean
}

export type ProductPaginatedResponse = PaginatedResponse<Product>
