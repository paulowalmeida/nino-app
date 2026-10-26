import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScreenPreviewFrame } from './ScreenPreviewFrame'
import { screenPreviewFrameMock } from './ScreenPreviewFrame.mock'

describe('ScreenPreviewFrame', () => {
  it('names the screen being demonstrated and shows its content', () => {
    render(
      <ScreenPreviewFrame screen={screenPreviewFrameMock.screen}>
        <p>{screenPreviewFrameMock.content}</p>
      </ScreenPreviewFrame>
    )

    expect(screen.getByText(screenPreviewFrameMock.screen)).toBeInTheDocument()
    expect(screen.getByText(screenPreviewFrameMock.content)).toBeInTheDocument()
  })
})
