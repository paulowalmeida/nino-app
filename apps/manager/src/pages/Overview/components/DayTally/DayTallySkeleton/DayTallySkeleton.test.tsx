import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DayTallySkeleton } from './DayTallySkeleton'
import { dayTallySkeletonMock } from './DayTallySkeleton.mock'

describe('DayTallySkeleton', () => {
  it('renders the tally placeholders', () => {
    const { container } = render(<DayTallySkeleton />)

    expect(container.firstChild).toBeTruthy()
    expect(dayTallySkeletonMock.label).toBe('Carregando')
  })
})
