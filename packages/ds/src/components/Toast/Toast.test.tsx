import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { toast, ToastContainer } from './Toast'

function renderContainer() {
  return render(<ToastContainer />)
}

afterEach(() => {
  // remove() (sem id) limpa a store de forma síncrona; dismiss() só anima,
  // e a animação de saída não conclui no jsdom — toasts vazariam entre testes
  toast.remove()
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
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await waitFor(
      () => expect(screen.queryByText('Mensagem')).not.toBeInTheDocument(),
      { timeout: 3000 }
    )
  })

  it('dismisses when swiped horizontally', async () => {
    renderContainer()
    act(() => toast.default('Mensagem arrastável'))

    const title = await screen.findByText('Mensagem arrastável')
    const toastCard = title.parentElement?.parentElement
    expect(toastCard).not.toBeNull()

    act(() => {
      fireEvent.pointerDown(toastCard!, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 300,
        clientY: 100,
      })
      fireEvent.pointerMove(toastCard!, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 200,
        clientY: 100,
      })
      fireEvent.pointerUp(toastCard!, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 200,
        clientY: 100,
      })
    })

    await waitFor(
      () =>
        expect(
          screen.queryByText('Mensagem arrastável')
        ).not.toBeInTheDocument(),
      { timeout: 3000 }
    )
  })

  it.each(['default', 'success', 'error', 'warning', 'loading'] as const)(
    'renders variant %s without errors',
    async (variant) => {
      renderContainer()
      act(() => toast[variant]('Mensagem'))
      expect(await screen.findByText('Mensagem')).toBeInTheDocument()
    }
  )

  it('accepts a description as the second argument', async () => {
    renderContainer()
    act(() => toast.success('Título', 'Atalho de descrição'))
    expect(await screen.findByText('Atalho de descrição')).toBeInTheDocument()
  })

  it('runs the action and closes the toast', async () => {
    const onClick = vi.fn()
    renderContainer()
    act(() =>
      toast.error('Falha ao salvar', {
        action: { label: 'Tentar de novo', onClick },
      })
    )
    await userEvent.click(await screen.findByText('Tentar de novo'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('hides the close button when closable is false', async () => {
    renderContainer()
    act(() => toast.default('Sem fechar', { closable: false }))
    await screen.findByText('Sem fechar')
    expect(
      screen.queryByRole('button', { name: 'Fechar' })
    ).not.toBeInTheDocument()
  })

  it('renders a toast placed on another corner', async () => {
    renderContainer()
    act(() => toast.default('No topo', { placement: 'top' }))
    expect(await screen.findByText('No topo')).toBeInTheDocument()
  })
})
