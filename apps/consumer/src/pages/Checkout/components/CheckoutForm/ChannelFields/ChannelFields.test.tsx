import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { ChannelFields } from './ChannelFields'
import { channelFieldsMock } from './ChannelFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('react-hook-form', () => ({
  Controller: ({ render }: { render: (args: unknown) => unknown }) => render({ field: { value: 'PICKUP', onChange: vi.fn() } }),
}))

describe('ChannelFields', () => {
  it('shows pickup when the store has no delivery zones', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      zones: [],
      deliveryNote: channelFieldsMock.deliveryNote,
      control: {},
    } as never)

    render(<ChannelFields />)

    expect(screen.getByText(channelFieldsMock.pickupLabel)).toBeInTheDocument()
    expect(screen.queryByText(channelFieldsMock.deliveryNote)).not.toBeInTheDocument()
  })
})
