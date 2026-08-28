import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import { Kitchen } from './Kitchen'

vi.mock('@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade')
vi.mock('./components/KitchenWorkspace/KitchenWorkspace', () => ({
  KitchenWorkspace: () => <div>kitchen workspace</div>,
}))

const facadeReturning = (isError: boolean) =>
  vi.mocked(useKitchenFacade).mockReturnValue({
    orders: [],
    isPending: false,
    isError,
    isAdvancing: false,
  } as never)

describe(Kitchen.name, () => {
  it('composes the kitchen workspace inside the screen', () => {
    facadeReturning(false)

    render(<Kitchen />)

    expect(screen.getByText('kitchen workspace')).toBeInTheDocument()
  })

  it('explains what to do when the orders fail to load', () => {
    facadeReturning(true)

    render(<Kitchen />)

    expect(screen.getByText(/Recarregue a página/)).toBeInTheDocument()
    expect(screen.queryByText('kitchen workspace')).not.toBeInTheDocument()
  })
})
