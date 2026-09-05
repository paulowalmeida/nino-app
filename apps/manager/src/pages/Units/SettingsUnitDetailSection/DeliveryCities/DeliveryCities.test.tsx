import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryCities } from './DeliveryCities'
import {
  deliveryCitiesMock,
  primaryDeliveryCityMock,
} from './DeliveryCities.mock'

describe('DeliveryCities', () => {
  it('keeps the unit city and renders configured coverage chips', () => {
    render(
      <DeliveryCities
        cities={deliveryCitiesMock}
        primaryCity={primaryDeliveryCityMock}
        location={
          {
            states: {
              data: [{ id: 15, sigla: 'PA', nome: 'Pará' }],
              isLoading: false,
              isError: false,
            },
            municipalities: {
              data: [{ id: 1501402, nome: 'Belém' }],
              isLoading: false,
              isError: false,
            },
          } as never
        }
        onStateChange={vi.fn()}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByText('Belém · PA')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /Remover Ananindeua, PA/i })
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /cidade da unidade/i })
    ).toBeDisabled()
  })
})
