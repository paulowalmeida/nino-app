import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Toast, ToastProvider, ToastViewport } from './Toast'

function renderToast(props = {}) {
  return render(
    <ToastProvider>
      <Toast title="Test message" open onOpenChange={vi.fn()} {...props} />
      <ToastViewport />
    </ToastProvider>
  )
}

describe(Toast.name, () => {
  it('renders the title', () => {
    renderToast()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    renderToast({ description: 'Additional info' })
    expect(screen.getByText('Additional info')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    renderToast()
    expect(screen.queryByText('Additional info')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when dismiss button is clicked', async () => {
    const onOpenChange = vi.fn()
    renderToast({ onOpenChange })
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it.each(['default', 'success', 'error', 'warning'] as const)(
    'renders variant %s without errors',
    (variant) => {
      renderToast({ variant })
      expect(screen.getByText('Test message')).toBeInTheDocument()
    }
  )
})
