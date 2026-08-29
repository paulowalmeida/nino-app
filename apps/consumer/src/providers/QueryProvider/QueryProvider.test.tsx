import { render, screen } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { queryClient } from '@lib/query-client'

import { QueryProvider } from './QueryProvider'
import { queryProviderMock } from './QueryProvider.mock'

const QueryClientProbe = () => {
  const client = useQueryClient()

  return (
    <span>
      {client === queryClient
        ? queryProviderMock.childText
        : 'cliente incorreto'}
    </span>
  )
}

describe('QueryProvider', () => {
  it('renders children with the application query client', () => {
    render(
      <QueryProvider>
        <QueryClientProbe />
      </QueryProvider>
    )

    expect(screen.getByText(queryProviderMock.childText)).toBeInTheDocument()
  })
})
