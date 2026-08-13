import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WelcomeStepTrack } from
  '@compositions/WelcomeStepTrack/WelcomeStepTrack'

import { twoStepPanels } from './WelcomeStepTrack.mock'

describe(WelcomeStepTrack.name, () => {
  it('renders a label for every panel', () => {
    // Arrange / Act
    render(<WelcomeStepTrack panels={twoStepPanels} index={0} />)

    // Assert
    expect(screen.getByText('Balcão')).toBeInTheDocument()
    expect(screen.getByText('Cozinha')).toBeInTheDocument()
  })

  it('marks the current and earlier steps as on', () => {
    // Arrange / Act
    render(<WelcomeStepTrack panels={twoStepPanels} index={1} />)

    // Assert
    const steps = screen.getAllByRole('listitem')
    expect(steps[0]).toHaveAttribute('data-on', 'true')
    expect(steps[1]).toHaveAttribute('data-on', 'true')
  })

  it('renders a single step with no line separator', () => {
    // Arrange / Act
    render(<WelcomeStepTrack panels={[twoStepPanels[0]]} index={0} />)

    // Assert
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
