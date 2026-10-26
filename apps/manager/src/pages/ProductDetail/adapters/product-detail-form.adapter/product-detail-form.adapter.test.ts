import { describe, expect, it } from 'vitest'

import {
  toProductFormValues,
  toReplaceProductModifiersRequest,
  toUpdateMenuItemRequest,
} from './product-detail-form.adapter'
import {
  menuItemMock,
  productDetailFormMock,
} from './product-detail-form.adapter.mock'

describe('product detail form adapters', () => {
  it('converts the form into an update request', () => {
    expect(toUpdateMenuItemRequest(productDetailFormMock)).toEqual({
      name: productDetailFormMock.name,
      description: productDetailFormMock.description,
      price: 25.9,
      pricingType: 'FIXED',
      categoryId: productDetailFormMock.categoryId,
      position: productDetailFormMock.position,
      isActive: true,
      requiresPreparation: true,
    })
  })

  it('converts a menu item into form values', () => {
    expect(toProductFormValues(menuItemMock)).toEqual({
      ...productDetailFormMock,
      description: '',
      price: '25,90',
    })
  })

  it('sends no description when the form field is left blank', () => {
    expect(
      toUpdateMenuItemRequest({ ...productDetailFormMock, description: '' })
    ).toEqual({
      name: productDetailFormMock.name,
      description: undefined,
      price: 25.9,
      pricingType: 'FIXED',
      categoryId: productDetailFormMock.categoryId,
      position: productDetailFormMock.position,
      isActive: true,
      requiresPreparation: true,
    })
  })

  it('converts composed choices and localized prices', () => {
    expect(
      toReplaceProductModifiersRequest([
        {
          name: ' Primeiro sabor ',
          description: '',
          role: 'COMPOSITION',
          minSelections: 1,
          maxSelections: 1,
          options: [{ name: ' Queijo ', price: '20,50' }],
        },
      ])
    ).toEqual([
      {
        name: 'Primeiro sabor',
        description: undefined,
        role: 'COMPOSITION',
        minSelections: 1,
        maxSelections: 1,
        options: [{ name: 'Queijo', price: 20.5 }],
      },
    ])
  })

  it('zeros the catalog base price for a composed product', () => {
    expect(
      toUpdateMenuItemRequest({
        ...productDetailFormMock,
        pricingType: 'COMPOSED',
      }).price
    ).toBe(0)
  })

  it('keeps legacy products configured for preparation', () => {
    expect(
      toProductFormValues({
        ...menuItemMock,
        requiresPreparation: undefined,
      }).requiresPreparation
    ).toBe(true)
  })
})
