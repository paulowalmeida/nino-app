import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressesHeader } from './AddressesHeader'
import { addressesHeaderMock } from './AddressesHeader.mock'

describe('AddressesHeader', () => {
  it('introduces the saved addresses section', () => {
    render(<AddressesHeader />)

    expect(
      screen.getByRole('heading', { name: addressesHeaderMock.heading })
    ).toBeInTheDocument()
  })
})
