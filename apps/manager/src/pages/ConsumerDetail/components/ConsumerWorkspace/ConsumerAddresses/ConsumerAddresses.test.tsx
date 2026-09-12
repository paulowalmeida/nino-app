import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerAddresses } from './ConsumerAddresses'
import { consumerAddressRowsMock } from './ConsumerAddresses.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)

describe('ConsumerAddresses', () => {
  it('lists every address and marks the primary one', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      addressRows: consumerAddressRowsMock,
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerAddresses />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      screen.getByText(consumerAddressRowsMock[0].streetLine)
    ).toHaveTextContent('Principal')
    expect(
      screen.getByText(consumerAddressRowsMock[1].streetLine)
    ).not.toHaveTextContent('Principal')
  })

  it('states the absence of addresses', () => {
    vi.mocked(useConsumerDetailFacade).mockReturnValue({
      addressRows: [],
    } as unknown as ReturnType<typeof useConsumerDetailFacade>)

    render(<ConsumerAddresses />)

    expect(
      screen.getByText('Nenhum endereço registrado ainda.')
    ).toBeInTheDocument()
  })
})
