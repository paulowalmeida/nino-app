import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { UnitDetailTabs } from './UnitDetailTabs'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/unidades/detalhe" element={<UnitDetailTabs />}>
          <Route index element={<div>informações</div>} />
          <Route path="horarios" element={<div>horários</div>} />
          <Route path="cashback" element={<div>cashback</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

describe(UnitDetailTabs.name, () => {
  it('shows the routed section of the active tab', () => {
    renderAt('/unidades/detalhe/horarios')

    expect(screen.getByText('horários')).toBeInTheDocument()
    expect(screen.queryByText('informações')).not.toBeInTheDocument()
  })

  it('walks to the section the reader picked', async () => {
    renderAt('/unidades/detalhe')

    await userEvent.click(screen.getByRole('tab', { name: 'Cashback' }))

    expect(await screen.findByText('cashback')).toBeInTheDocument()
  })

  it('falls back to information when the path names no section', () => {
    renderAt('/unidades/detalhe')

    expect(screen.getByText('informações')).toBeInTheDocument()
  })

  it('walks back to information from another section', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    renderAt('/unidades/detalhe/cashback')

    await userEvent.click(screen.getByRole('tab', { name: 'Informações' }))

    expect(await screen.findByText('informações')).toBeInTheDocument()
  })
})
