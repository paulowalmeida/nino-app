import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StoreHeaderSkeleton } from './StoreHeaderSkeleton'

describe('StoreHeaderSkeleton', () => {
  it('announces that the store header is loading', () => {
    render(<StoreHeaderSkeleton showBanner showSearch />)

    expect(
      screen.getByLabelText('Carregando cabeçalho da loja')
    ).toHaveAttribute('aria-busy', 'true')
  })

  it('keeps a fixed banner placeholder while loading', () => {
    const { container } = render(
      <StoreHeaderSkeleton showBanner showSearch={false} />
    )

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('[class*="bannerFill"]')).toBeInTheDocument()
  })
})
