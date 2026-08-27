import { describe, expect, it } from 'vitest'

import { toCreateStoreRequest } from './first-store-form.adapter'
import { firstStoreFormMock } from './first-store-form.adapter.mock'

describe(toCreateStoreRequest.name, () => {
  it('normalizes the store slug and zip code for the API request', () => {
    expect(toCreateStoreRequest(firstStoreFormMock)).toMatchObject({
      ...firstStoreFormMock,
      slug: 'cafe-da-vila',
      zipCode: '66000000',
    })
  })
})
