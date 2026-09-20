import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BrandTracking } from './BrandTracking'
import { trackingDraftMock } from './BrandTracking.mock'

const onChange = vi.fn()

describe(BrandTracking.name, () => {
  beforeEach(() => onChange.mockClear())

  it('shows the store voice already saved for a stage', () => {
    render(
      <BrandTracking tracking={trackingDraftMock} onChange={onChange} />
    )

    expect(screen.getByLabelText('Pedido recebido')).toHaveValue(
      'Pedido na casa'
    )
  })

  it('offers the nino default as the placeholder of an untouched stage', () => {
    render(
      <BrandTracking tracking={trackingDraftMock} onChange={onChange} />
    )

    expect(screen.getByLabelText('Em preparo')).toHaveAttribute(
      'placeholder',
      'Tá na chapa'
    )
  })

  it('reports an edited stage label without dropping the others', async () => {
    render(
      <BrandTracking tracking={trackingDraftMock} onChange={onChange} />
    )

    await userEvent.type(screen.getByLabelText('Entregue'), 'B')

    expect(onChange).toHaveBeenCalledWith({
      stageLabels: { ...trackingDraftMock.stageLabels, DELIVERED: 'B' },
    })
  })

  it('reports the waiting message on its own', async () => {
    render(
      <BrandTracking tracking={trackingDraftMock} onChange={onChange} />
    )

    await userEvent.type(screen.getByLabelText('Mensagem de espera'), 'O')

    expect(onChange).toHaveBeenCalledWith({ waitingMessage: 'O' })
  })
})
