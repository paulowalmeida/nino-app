import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { StoreSign } from './StoreSign'
import { storeSignMock } from './StoreSign.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')

describe('StoreSign', () => {
  it('renders a loading sign', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      storeOpen: { isOpen: false, isPending: true, hasSchedule: true },
    } as never)

    render(<StoreSign />)

    expect(screen.queryByText('Aberta agora')).not.toBeInTheDocument()
  })

  it('describes an open store', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      storeOpen: { ...storeSignMock, isPending: false },
    } as never)

    render(<StoreSign />)

    expect(screen.getByText('Aberta agora')).toBeInTheDocument()
  })

  it('renders no sign when the store has no schedule', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      storeOpen: { isOpen: false, isPending: false, hasSchedule: false },
    } as never)

    render(<StoreSign />)

    expect(screen.queryByText('Aberta agora')).not.toBeInTheDocument()
  })

  it('describes a closed store', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      storeOpen: { isOpen: false, isPending: false, hasSchedule: true },
    } as never)

    render(<StoreSign />)

    expect(screen.getByText('Fechada agora')).toBeInTheDocument()
  })
})
