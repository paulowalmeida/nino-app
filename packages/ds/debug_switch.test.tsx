import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'
import { Switch } from './src/components/Switch/Switch'

describe('debug', () => {
  it('shows dom', () => {
    render(<Switch aria-label="toggle" />)
    screen.debug()
  })
})
