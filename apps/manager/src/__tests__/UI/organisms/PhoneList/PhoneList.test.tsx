import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PhoneList } from '@organisms/PhoneList/PhoneList'

import { phones } from './PhoneList.mock'

const renderList = (props: Partial<React.ComponentProps<typeof PhoneList>>) =>
  render(
    <PhoneList
      phones={[]}
      isPending={false}
      isAdding={false}
      onAdd={vi.fn()}
      onEdit={vi.fn()}
      onRemove={vi.fn()}
      {...props}
    />
  )

describe(PhoneList.name, () => {
  it('shows a skeleton while phones are loading', () => {
    // Arrange / Act
    const { container } = renderList({ isPending: true })

    // Assert
    expect(container.querySelector('[aria-hidden="true"]'))
      .toBeInTheDocument()
    expect(screen.queryByText('Nenhum telefone cadastrado.'))
      .not.toBeInTheDocument()
  })

  it('shows the empty state with no phone registered', () => {
    // Arrange / Act
    renderList({ phones: [] })

    // Assert
    expect(screen.getByText('Nenhum telefone cadastrado.'))
      .toBeInTheDocument()
  })

  it('lists every phone already formatted', () => {
    // Arrange / Act
    renderList({ phones })

    // Assert
    expect(screen.getByText('(85) 99999-8888')).toBeInTheDocument()
    expect(screen.getByText('(85) 98888-7777')).toBeInTheDocument()
  })

  it('adds a new phone once ten digits are typed', async () => {
    // Arrange
    const onAdd = vi.fn()
    renderList({ onAdd })

    // Act
    await userEvent.type(
      screen.getByPlaceholderText('(00) 00000-0000'),
      '85999998888'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar telefone' })
    )

    // Assert
    expect(onAdd).toHaveBeenCalledWith('+5585999998888')
  })

  it('ignores adding when fewer than ten digits were typed', async () => {
    // Arrange
    const onAdd = vi.fn()
    renderList({ onAdd })

    // Act
    await userEvent.type(
      screen.getByPlaceholderText('(00) 00000-0000'),
      '859999'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar telefone' })
    )

    // Assert
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('commits an edit for the phone that was clicked', async () => {
    // Arrange
    const onEdit = vi.fn()
    renderList({ phones, onEdit })
    await userEvent.click(screen.getByText('(85) 99999-8888'))

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(onEdit).toHaveBeenCalledWith('phone-1', '+5585999998888')
  })

  it('removes the phone that was clicked', async () => {
    // Arrange
    const onRemove = vi.fn()
    renderList({ phones, onRemove })

    // Act
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Remover' })[0]
    )

    // Assert
    expect(onRemove).toHaveBeenCalledWith('phone-1')
  })
})
