import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SettingsUnitSkeleton } from './SettingsUnitSkeleton'
import { settingsUnitSkeletonMock } from './SettingsUnitSkeleton.mock'

describe('SettingsUnitSkeleton', () => {
  it('announces loading and mirrors the header and unit rows', () => {
    const { container } = render(<SettingsUnitSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando lojas da empresa'
    )

    const unitCount = settingsUnitSkeletonMock.placeholderUnitCount
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThanOrEqual(unitCount * 2)
  })
})
