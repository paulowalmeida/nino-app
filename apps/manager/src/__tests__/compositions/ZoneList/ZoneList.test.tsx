import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoneList } from '@compositions/ZoneList/ZoneList'

import { activeZone, pausedZone } from './ZoneList.mock'

const renderZones = (
  props: Partial<React.ComponentProps<typeof ZoneList>> = {}
) =>
  render(
    <ZoneList
      zones={[]}
      isPending={false}
      isAdding={false}
      onAdd={vi.fn()}
      onEdit={vi.fn()}
      onToggle={vi.fn()}
      onRemove={vi.fn()}
      {...props}
    />
  )

describe(ZoneList.name, () => {
  it('shows a skeleton while zones are loading', () => {
    // Arrange / Act
    const { container } = renderZones({ isPending: true })

    // Assert
    expect(screen.queryByText('Adicionar região')).not.toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('shows the empty state with no zones registered', () => {
    // Arrange / Act
    renderZones({ zones: [] })

    // Assert
    expect(
      screen.getByText(/Nenhuma região cadastrada/)
    ).toBeInTheDocument()
  })

  it('lists registered zones with name, fee and active state', () => {
    // Arrange
    const { container } = renderZones({ zones: [activeZone, pausedZone] })

    // Assert
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText('R$ 5,00')).toBeInTheDocument()
    const controls = container.querySelectorAll('[data-part="control"]')
    expect(controls[0]).toHaveAttribute('data-state', 'checked')
    expect(controls[1]).toHaveAttribute('data-state', 'unchecked')
  })

  it('calls onToggle when switching a zone on or off', async () => {
    // Arrange
    const onToggle = vi.fn()
    renderZones({ zones: [activeZone], onToggle })

    // Act
    await userEvent.click(screen.getByLabelText('Centro atendido'))

    // Assert
    expect(onToggle).toHaveBeenCalledWith('zone-1', false)
  })

  it('calls onRemove when removing a zone', async () => {
    // Arrange
    const onRemove = vi.fn()
    renderZones({ zones: [activeZone], onRemove })

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))

    // Assert
    expect(onRemove).toHaveBeenCalledWith('zone-1')
  })

  it('keeps add disabled until a name is typed', () => {
    // Arrange / Act
    renderZones()

    // Assert
    expect(
      screen.getByRole('button', { name: 'Adicionar região' })
    ).toBeDisabled()
  })

  it('calls onAdd with the typed name and parsed fee', async () => {
    // Arrange
    const onAdd = vi.fn()
    renderZones({ onAdd })

    // Act
    await userEvent.type(
      screen.getByPlaceholderText('Bairro ou região'),
      'Vila Nova'
    )
    await userEvent.type(screen.getByPlaceholderText('Taxa'), '7,50')
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar região' })
    )

    // Assert
    expect(onAdd).toHaveBeenCalledWith({ name: 'Vila Nova', fee: 7.5 })
  })

  it('switches a zone row into edit mode and commits the change', async () => {
    // Arrange
    const onEdit = vi.fn()
    renderZones({ zones: [activeZone], onEdit })

    // Act
    await userEvent.click(screen.getByText('Editar'))
    const editName = screen.getByLabelText('Nome da região')
    await userEvent.clear(editName)
    await userEvent.type(editName, 'Centro Histórico')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(onEdit).toHaveBeenCalledWith('zone-1', {
      name: 'Centro Histórico',
      fee: 5,
    })
  })
})
