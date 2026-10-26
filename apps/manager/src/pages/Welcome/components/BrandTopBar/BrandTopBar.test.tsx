import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useWelcomeFacade } from '@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade'

import { BrandTopBar } from './BrandTopBar'
import { brandTopBarMock } from './BrandTopBar.mock'

vi.mock('@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade')

const leave = vi.fn()

describe('BrandTopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useWelcomeFacade).mockReturnValue({
      firstName: 'Maria',
      leave,
    })
  })

  it('lets the owner skip the tour', async () => {
    render(
      <MemoryRouter>
        <BrandTopBar />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: brandTopBarMock.actionLabel })
    )

    expect(leave).toHaveBeenCalled()
  })
})
