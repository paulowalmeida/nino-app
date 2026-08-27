import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CompanyCard } from './CompanyCard'

describe('CompanyCard', () => {
  it('renders its loading state', () => {
    const { container } = render(<CompanyCard company={undefined} isPending isSaving={false} onSave={() => undefined} />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
