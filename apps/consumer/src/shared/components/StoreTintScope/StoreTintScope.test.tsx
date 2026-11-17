import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'
import { StoreTintScope } from './StoreTintScope'

vi.mock('@shared/hooks/useStoreTint/useStoreTint')

describe('StoreTintScope', () => {
  it('declara a cor da loja para o conteúdo', () => {
    vi.mocked(useStoreTint).mockReturnValue('#123456')
    render(<StoreTintScope>conteúdo</StoreTintScope>)
    expect(screen.getByText('conteúdo')).toHaveStyle({
      '--store-tint': '#123456',
    })
  })

  it('não declara nada quando a loja não tem cor', () => {
    vi.mocked(useStoreTint).mockReturnValue(undefined)
    render(<StoreTintScope>conteúdo</StoreTintScope>)
    expect(screen.getByText('conteúdo').getAttribute('style')).toBeNull()
  })
})
