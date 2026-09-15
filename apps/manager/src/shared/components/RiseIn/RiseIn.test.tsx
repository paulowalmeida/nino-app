import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RiseIn } from './RiseIn'
import { riseInChildrenMock } from './RiseIn.mock'

describe(RiseIn.name, () => {
  it('renders its content in the requested semantic container', () => {
    render(<RiseIn as="section">{riseInChildrenMock}</RiseIn>)
    expect(screen.getByText(riseInChildrenMock).closest('section')).toBeInTheDocument()
  })
})
