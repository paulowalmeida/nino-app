import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NewUnit } from './NewUnit'
import { newUnitBreadcrumbMock } from './NewUnit.mock'

vi.mock('@shared/components/Breadcrumb/Breadcrumb', () => ({
  Breadcrumb: ({ trail }: { trail: { label: string; to?: string }[] }) => (
    <nav>
      {trail.map(({ label, to }) => (
        <span key={label} data-to={to}>
          {label}
        </span>
      ))}
    </nav>
  ),
}))
vi.mock('@pages/NewUnit/components/NewUnitContent/NewUnitContent', () => ({
  NewUnitContent: () => <div>new unit form</div>,
}))

describe(NewUnit.name, () => {
  it('sends each crumb to a real place, not back to the new-unit screen', () => {
    render(<NewUnit />)
    const trail = within(screen.getByRole('navigation'))

    newUnitBreadcrumbMock.forEach(({ label, to }) => {
      const crumb = trail.getByText(label)
      if (to) expect(crumb).toHaveAttribute('data-to', to)
      else expect(crumb).not.toHaveAttribute('data-to')
    })
  })

  it('opens the form to create a unit', () => {
    render(<NewUnit />)

    expect(screen.getByText('new unit form')).toBeInTheDocument()
  })
})
