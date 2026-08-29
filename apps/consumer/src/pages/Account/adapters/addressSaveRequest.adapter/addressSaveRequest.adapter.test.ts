import { describe, expect, it } from 'vitest'

import { addressSaveRequest } from './addressSaveRequest.adapter'
import { addressSaveRequestMock } from './addressSaveRequest.adapter.mock'

describe('addressSaveRequest', () => {
  it('converts an address into the shape the API accepts back', () => {
    // Arrange
    // Act
    const request = addressSaveRequest(addressSaveRequestMock.withComplement)

    // Assert
    expect(request).toEqual({
      zipCode: '01001000',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 12',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    })
  })

  it('converts a null complement into undefined', () => {
    // Arrange
    // Act
    const request = addressSaveRequest(addressSaveRequestMock.noComplement)

    // Assert
    expect(request.complement).toBeUndefined()
  })
})
