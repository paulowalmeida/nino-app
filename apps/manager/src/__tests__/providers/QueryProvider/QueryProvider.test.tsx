import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { queryClient } from '@lib/query-client'
import { QueryProvider } from '@providers/QueryProvider/QueryProvider'

const ClientProbe = () => {
  const client = useQueryClient()
  return <span>{client === queryClient ? 'same-client' : 'other-client'}</span>
}

describe(QueryProvider.name, () => {
  it('renders its children', () => {
    // Arrange / Act
    render(
      <QueryProvider>
        <span>child content</span>
      </QueryProvider>
    )

    // Assert
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('exposes the shared query client to descendants', () => {
    // Arrange / Act
    render(
      <QueryProvider>
        <ClientProbe />
      </QueryProvider>
    )

    // Assert
    expect(screen.getByText('same-client')).toBeInTheDocument()
  })
})
