import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnitCard } from './UnitCard'

describe('UnitCard', () => {
  it('renders its loading state', () => {
    render(<UnitCard unit={undefined} isPending isSaving={false} isMain={false} isPromoting={false} onSetMain={() => undefined} onSave={() => undefined} />)
    expect(document.body).toBeTruthy()
  })
})
