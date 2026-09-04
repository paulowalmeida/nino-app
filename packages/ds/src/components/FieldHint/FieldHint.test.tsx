import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FieldHint } from './FieldHint'
import { fieldHintProps } from './FieldHint.mock'

describe(FieldHint.name, () => {
  it('renders the label and the hint trigger', () => {
    render(<FieldHint {...fieldHintProps} />)

    expect(screen.getByText(fieldHintProps.label)).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: `Mais informações sobre ${fieldHintProps.label}`,
      })
    ).toBeInTheDocument()
  })
})
