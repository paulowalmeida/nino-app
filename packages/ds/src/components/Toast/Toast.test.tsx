import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { toast, ToastContainer, toaster } from './Toast'

function renderContainer() {
  return render(<ToastContainer />)
}

afterEach(() => {
  // remove() (sem id) limpa a store de forma síncrona; dismiss() só anima,
  // e a animação de saída não conclui no jsdom — toasts vazariam entre testes
  toaster.remove()
})

describe(ToastContainer.name, () => {
  it('renders the title', async () => {
    renderContainer()
    act(() => toast.default('Mensagem de teste'))
    expect(await screen.findByText('Mensagem de teste')).toBeInTheDocument()
  })

  it('renders the description when provided', async () => {
    renderContainer()
    act(() => toast.default('Título', 'Informação adicional'))
    expect(await screen.findByText('Informação adicional')).toBeInTheDocument()
  })

  it('does not render description when absent', async () => {
    renderContainer()
    act(() => toast.default('Só título'))
    await screen.findByText('Só título')
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('closes when the close button is clicked', async () => {
    renderContainer()
    act(() => toast.default('Mensagem'))
    await screen.findByText('Mensagem')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(
      () => expect(screen.queryByText('Mensagem')).not.toBeInTheDocument(),
      { timeout: 3000 }
    )
  })

  it.each(['default', 'success', 'error', 'warning'] as const)(
    'renderiza variant %s sem erros',
    async (variant) => {
      renderContainer()
      act(() => toast[variant]('Mensagem'))
      expect(await screen.findByText('Mensagem')).toBeInTheDocument()
    }
  )
})
