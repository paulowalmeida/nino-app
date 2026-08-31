import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressesEmptyState } from './AddressesEmptyState'
import { addressesEmptyStateMock } from './AddressesEmptyState.mock'

describe('AddressesEmptyState', () => {
  it('explains how the first saved address is used', () => {
    render(<AddressesEmptyState />)

    expect(
      screen.getByText(addressesEmptyStateMock.message)
    ).toBeInTheDocument()
  })
})
