import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AddressSuggestionList } from './AddressSuggestionList'
import { addressSuggestionMock } from './AddressSuggestionList.mock'

describe('AddressSuggestionList', () => {
  it('tells what is being searched while Google answers', () => {
    render(
      <AddressSuggestionList
        searchedText="Rua das Flores, 26"
        suggestions={[]}
        isLoading
        onSelect={vi.fn()}
      />
    )

    expect(
      screen.getByText('Procurando Rua das Flores, 26…')
    ).toBeInTheDocument()
  })

  it('hands back the place the customer picked', () => {
    const onSelect = vi.fn()
    render(
      <AddressSuggestionList
        searchedText="Rua das Flores, 26"
        suggestions={[addressSuggestionMock]}
        isLoading={false}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByText(addressSuggestionMock.mainText))

    expect(onSelect).toHaveBeenCalledWith(addressSuggestionMock.placeId)
  })

  it('explains when nothing matched', () => {
    render(
      <AddressSuggestionList
        searchedText="Rua que não existe, 1"
        suggestions={[]}
        isLoading={false}
        onSelect={vi.fn()}
      />
    )

    expect(
      screen.getByText(
        'Nenhum endereço encontrado. Confira o logradouro e o número.'
      )
    ).toBeInTheDocument()
  })

  it('distinguishes lookup errors from an empty result and offers retry', async () => {
    const onRetry = vi.fn()
    render(
      <AddressSuggestionList
        searchedText="Rua das Flores, 26"
        suggestions={[]}
        isLoading={false}
        isError
        onRetry={onRetry}
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível buscar este endereço'
    )
    expect(screen.queryByText(/Nenhum endereço encontrado/)).toBeNull()

    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar novamente' })
    )
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
