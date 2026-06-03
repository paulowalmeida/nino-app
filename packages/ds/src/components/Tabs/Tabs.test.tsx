import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Tabs } from './Tabs'

const tabs = [
  { value: 'a', label: 'Aba A', content: <span>Conteúdo A</span> },
  { value: 'b', label: 'Aba B', content: <span>Conteúdo B</span> },
  { value: 'c', label: 'Aba C', content: <span>Conteúdo C</span>, disabled: true },
]

describe(Tabs.name, () => {
  it('renders the tabs', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByRole('tab', { name: 'Aba A' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Aba B' })).toBeInTheDocument()
  })

  it('activates the first tab by default', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByRole('tab', { name: 'Aba A' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('displays the active tab content', () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByText('Conteúdo A')).toBeVisible()
  })

  it('switches tabs on click', async () => {
    render(<Tabs tabs={tabs} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Aba B' }))
    expect(screen.getByRole('tab', { name: 'Aba B' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByText('Conteúdo B')).toBeVisible()
  })

  it('disabled tab cannot be clicked', async () => {
    render(<Tabs tabs={tabs} />)
    expect(screen.getByRole('tab', { name: 'Aba C' })).toBeDisabled()
  })

  it('respects defaultValue', () => {
    render(<Tabs tabs={tabs} defaultValue="b" />)
    expect(screen.getByRole('tab', { name: 'Aba B' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })
})
