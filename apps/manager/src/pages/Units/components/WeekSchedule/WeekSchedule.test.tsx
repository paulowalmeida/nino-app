import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WeekSchedule } from './WeekSchedule'

describe('WeekSchedule', () => {
  it('renders the weekly schedule', () => {
    render(
      <WeekSchedule
        hours={[]}
        isPending={false}
        isSaving={false}
        onSave={async () => undefined}
      />
    )
    expect(screen.getByText('Quando a loja abre')).toBeInTheDocument()
  })
})
