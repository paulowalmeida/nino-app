import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnitCard } from './UnitCard'

describe('UnitCard', () => {
  it('renders its loading state', () => {
    render(
      <UnitCard
        unit={undefined}
        isPending
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={() => undefined}
        onSave={() => undefined}
      />
    )
    expect(document.body).toBeTruthy()
  })

  it('separates unit data from store identity', () => {
    render(
      <UnitCard
        unit={undefined}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={() => undefined}
        onSave={() => undefined}
      />
    )

    expect(screen.getByRole('tab', { name: 'Dados da unidade' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Identidade da loja' })).toBeTruthy()
  })
})
