import { describe, expect, it } from 'vitest'

import { toCreateStoreRequest } from './first-store-form.adapter'
import { firstStoreFormMock } from './first-store-form.adapter.mock'

describe(toCreateStoreRequest.name, () => {
  it('normalizes the store slug and zip code for the API request', () => {
    expect(toCreateStoreRequest(firstStoreFormMock)).toEqual({
      ...firstStoreFormMock,
      slug: 'cafe-da-vila',
      zipCode: '66000000',
    })
  })

  it('does not forward runtime-only fields to the API', () => {
    const values = { ...firstStoreFormMock, isAdmin: true } as typeof firstStoreFormMock & {
      isAdmin: boolean
    }

    expect(toCreateStoreRequest(values)).not.toHaveProperty('isAdmin')
  })
})
