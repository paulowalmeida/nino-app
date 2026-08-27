import { describe, expect, it } from 'vitest'

import {
  toProductFormValues,
  toUpdateMenuItemRequest,
} from './product-detail-form.adapter'
import {
  menuItemMock,
  productDetailFormMock,
} from './product-detail-form.adapter.mock'

describe('product detail form adapters', () => {
  it('converts the form into an update request', () => {
    expect(toUpdateMenuItemRequest(productDetailFormMock)).toEqual({
      ...productDetailFormMock,
      price: 25.9,
    })
  })

  it('converts a menu item into form values', () => {
    expect(toProductFormValues(menuItemMock)).toEqual({
      ...productDetailFormMock,
      description: '',
      price: '25,90',
    })
  })
})
