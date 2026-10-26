import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CampaignTableSkeleton } from './CampaignTableSkeleton'
import { campaignTableSkeletonMock } from './CampaignTableSkeleton.mock'

describe(CampaignTableSkeleton.name, () => {
  it('announces the loading table with the same columns', () => {
    render(<CampaignTableSkeleton />)

    expect(
      screen.getByLabelText(campaignTableSkeletonMock.label)
    ).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('columnheader', { name: 'Usos' })).toBeInTheDocument()
  })
})
