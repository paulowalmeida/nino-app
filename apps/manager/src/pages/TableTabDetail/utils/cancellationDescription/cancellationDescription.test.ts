import { describe, expect, it } from 'vitest'

import { cancellationDescription } from './cancellationDescription'
import { cancellationDescriptionMock } from './cancellationDescription.mock'

describe('cancellationDescription', () => {
  it('describes the removal of one selected item', () => {
    expect(
      cancellationDescription(
        cancellationDescriptionMock.oneItem.itemCount,
        cancellationDescriptionMock.oneItem.itemNames
      )
    ).toBe(
      '1 item será retirado da comanda: Café. O total será recalculado. Esta ação não pode ser desfeita.'
    )
  })

  it('describes the removal of multiple selected items', () => {
    expect(
      cancellationDescription(
        cancellationDescriptionMock.multipleItems.itemCount,
        cancellationDescriptionMock.multipleItems.itemNames
      )
    ).toBe(
      '2 itens serão retirados da comanda: Café, Bolo. O total será recalculado. Esta ação não pode ser desfeita.'
    )
  })
})
