import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoadingPreview } from './LoadingPreview'
import { loadingPreviewMock } from './LoadingPreview.mock'

describe(LoadingPreview.name, () => {
  it('shows the chosen indicator over the store background', () => {
    render(<LoadingPreview {...loadingPreviewMock} />)

    const stage = screen.getByLabelText('Prévia da abertura da loja')
    expect(stage).toHaveStyle({ backgroundColor: '#FFFFFF' })
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('swaps the indicator with the chosen loading style', () => {
    const { rerender } = render(<LoadingPreview {...loadingPreviewMock} />)
    expect(screen.getByRole('status')).toHaveAttribute('width', '32')

    rerender(<LoadingPreview {...loadingPreviewMock} loadingType="DOTS" />)

    expect(screen.getByRole('status')).not.toHaveAttribute('width')
  })
})
