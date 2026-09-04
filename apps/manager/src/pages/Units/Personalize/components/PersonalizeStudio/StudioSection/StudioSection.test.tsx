import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { StudioSection } from './StudioSection'
import { studioSectionMock } from './StudioSection.mock'

describe(StudioSection.name, () => {
  it('opens with its content in the open, under a named region', () => {
    render(
      <StudioSection {...studioSectionMock}>
        <p>Conteúdo da seção</p>
      </StudioSection>
    )

    expect(screen.getByRole('region', { name: 'Cores' })).toBeInTheDocument()
    expect(screen.getByText(studioSectionMock.description)).toBeVisible()
    expect(screen.getByText('Conteúdo da seção')).toBeVisible()
  })

  it('folds the content away when the title is clicked', async () => {
    render(
      <StudioSection {...studioSectionMock}>
        <p>Conteúdo da seção</p>
      </StudioSection>
    )

    const toggle = screen.getByRole('button', { name: /Cores/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(toggle)

    await waitFor(() =>
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    )
  })
})
