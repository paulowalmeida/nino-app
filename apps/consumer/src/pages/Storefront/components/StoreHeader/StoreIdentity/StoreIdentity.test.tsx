import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storefrontStoreMock as homeStoreMock } from '@pages/Storefront/Storefront.mock'

import { StoreIdentity } from './StoreIdentity'
import { storeIdentityMock } from './StoreIdentity.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))

describe('StoreIdentity', () => {
  it('hides the delivery estimate and opens details when ordering is unavailable', () => {
    const setInfoOpen = vi.fn()
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: { ...homeStoreMock, isPaused: true },
      isHoursPending: false,
      hours: [],
      estimatedMinutes: storeIdentityMock.estimatedMinutes,
      setInfoOpen,
    } as never)

    render(<StoreIdentity />)

    expect(screen.getByText('Fechado')).toBeInTheDocument()
    expect(
      screen.queryByText(`~${storeIdentityMock.estimatedMinutes} min`)
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Detalhes da loja' }))
    expect(setInfoOpen).toHaveBeenCalledWith(true)
  })
})
