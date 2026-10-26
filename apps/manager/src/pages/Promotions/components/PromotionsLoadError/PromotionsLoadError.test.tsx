import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import { PromotionsLoadError } from './PromotionsLoadError'
import { promotionsLoadErrorMock } from './PromotionsLoadError.mock'

vi.mock('@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade')

describe(PromotionsLoadError.name, () => {
  it('reloads the campaigns on retry', async () => {
    const retry = vi.fn()
    vi.mocked(usePromotionsFacade).mockReturnValue({
      retry,
    } as unknown as ReturnType<typeof usePromotionsFacade>)

    render(<PromotionsLoadError />)
    await userEvent.click(
      screen.getByRole('button', { name: promotionsLoadErrorMock.retryLabel })
    )

    expect(retry).toHaveBeenCalled()
  })
})
