import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Label } from './Label'

describe(Label.name, () => {
  it('renders the label text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders the required asterisk when required is true', () => {
    render(<Label required>Name</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not render the asterisk when required is false', () => {
    render(<Label>Name</Label>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
