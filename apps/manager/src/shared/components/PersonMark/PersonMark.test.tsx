import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PersonMark } from './PersonMark'
import { personMarkNameMock } from './PersonMark.mock'

describe(PersonMark.name, () => {
  it('shows the person initials in the avatar', () => {
    render(<PersonMark name={personMarkNameMock} />)
    expect(screen.getByText('MS')).toBeInTheDocument()
  })
})
