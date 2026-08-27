import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProfileFieldsSkeleton } from './ProfileFieldsSkeleton'

describe('ProfileFieldsSkeleton', () => {
  it('renders the profile field placeholders', () => {
    const { container } = render(<ProfileFieldsSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3)
  })
})
