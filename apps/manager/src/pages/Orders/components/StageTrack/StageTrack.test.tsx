import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StageTrack } from './StageTrack'
import { stageTrackMock } from './StageTrack.mock'

const stages = [
  {
    id: 'incoming' as const,
    label: 'Novos',
    count: 2,
    icon: 'receipt' as const,
  },
  {
    id: 'closed' as const,
    label: 'Finalizados',
    count: 1,
    icon: 'check' as const,
  },
]

describe('StageTrack', () => {
  it('renders the selected stage and emits a changed stage', () => {
    const onChange = vi.fn()
    render(
      <StageTrack
        stages={stages}
        value={stageTrackMock.selectedStage}
        onChange={onChange}
      />
    )

    expect(
      screen.getByRole('tablist', { name: 'Etapas da fila' })
    ).toBeInTheDocument()
    expect(screen.getByText('Novos')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Novos'))
    expect(onChange).toHaveBeenCalledWith(stageTrackMock.selectedStage)
    fireEvent.click(screen.getByText('Finalizados'))
    expect(onChange).toHaveBeenCalledWith('closed')
  })
})
