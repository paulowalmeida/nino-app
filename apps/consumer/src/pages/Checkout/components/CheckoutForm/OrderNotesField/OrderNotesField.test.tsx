import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { OrderNotesField } from './OrderNotesField'
import { orderNotesFieldMock } from './OrderNotesField.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

describe('OrderNotesField', () => {
  it('offers an optional note for the store', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      register: () => ({}),
    } as never)

    render(<OrderNotesField />)

    expect(
      screen.getByText(orderNotesFieldMock.triggerLabel)
    ).toBeInTheDocument()
  })
})
