import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WelcomeStepTrack } from './WelcomeStepTrack'
import { welcomeStepTrackPanelsMock } from './WelcomeStepTrack.mock'

describe('WelcomeStepTrack', () => {
  it('names every leg of the tour', () => {
    render(<WelcomeStepTrack panels={welcomeStepTrackPanelsMock} index={0} />)

    expect(screen.getByText('Balcão')).toBeInTheDocument()
    expect(screen.getByText('Cozinha')).toBeInTheDocument()
  })

  it('marks legs up to the current one as done', () => {
    render(<WelcomeStepTrack panels={welcomeStepTrackPanelsMock} index={1} />)

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-on', 'true')
    expect(items[1]).toHaveAttribute('data-on', 'true')
  })
})
