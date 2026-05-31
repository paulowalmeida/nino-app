import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Tooltip, TooltipProvider } from './Tooltip'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}

describe(Tooltip.name, () => {
  it('does not display content by default', () => {
    render(
      <Wrapper>
        <Tooltip content="Dica">
          <button>gatilho</button>
        </Tooltip>
      </Wrapper>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('displays content on mouse hover', async () => {
    render(
      <Wrapper>
        <Tooltip content="Dica visível">
          <button>gatilho</button>
        </Tooltip>
      </Wrapper>
    )
    await userEvent.hover(screen.getByRole('button', { name: 'gatilho' }))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })

  it('displays when open=true', () => {
    render(
      <Wrapper>
        <Tooltip content="Sempre visível" open>
          <button>gatilho</button>
        </Tooltip>
      </Wrapper>
    )
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })
})
