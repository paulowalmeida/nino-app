import { describe, expect, it } from 'vitest'

import { toCreateMenuItemRequest } from './product-form.adapter'
import { productFormMock } from './product-form.adapter.mock'

describe(toCreateMenuItemRequest.name, () => {
  it('converts the new product form into an API request', () => {
    expect(toCreateMenuItemRequest(productFormMock)).toEqual({
      name: 'X-Tudo',
      description: 'Hambúrguer com queijo',
      price: 25.9,
      categoryId: 'burgers',
      requiresPreparation: true,
    })
  })

  it('omits an empty description', () => {
    expect(
      toCreateMenuItemRequest({ ...productFormMock, description: '' })
        .description
    ).toBeUndefined()
  })
})
