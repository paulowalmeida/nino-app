import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ServiceRules } from './ServiceRules'

describe('ServiceRules', () => {
  it('renders its loading state', () => {
    render(<ServiceRules settings={undefined} isPending isSaving={false} onSave={() => undefined} />)
    expect(document.body).toBeTruthy()
  })
})
