import { Button } from '@nino/ds'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FormBuilder } from './FormBuilder'
import { FieldConfig } from './types'

const schema: FieldConfig[] = [
  {
    name: 'nome',
    type: 'text',
    label: 'Nome',
    required: true,
    rules: { required: 'Nome obrigatório' },
  },
  {
    name: 'categoria',
    type: 'select',
    label: 'Categoria',
    options: [
      { value: 'a', label: 'Alimento' },
      { value: 'b', label: 'Bebida' },
    ],
  },
  { name: 'ativo', type: 'switch', label: 'Ativo' },
]

describe('FormBuilder', () => {
  it('renderiza os campos do schema com seus labels', () => {
    render(<FormBuilder schema={schema} onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByText('Categoria')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renderiza campo switch em layout horizontal (label ao lado)', () => {
    const { container } = render(
      <FormBuilder schema={schema} onSubmit={vi.fn()} />
    )
    const rows = container.querySelectorAll('.flex.items-center')
    const switchRow = Array.from(rows).find((r) =>
      r.textContent?.includes('Ativo')
    )
    expect(switchRow).toBeTruthy()
    expect(switchRow?.querySelector('[data-part="control"]')).toBeInTheDocument()
  })

  it('valida required e bloqueia o submit', async () => {
    const onSubmit = vi.fn()
    render(<FormBuilder schema={schema} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByText('Nome obrigatório')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('liga o erro do campo ao input via FormField', async () => {
    const onSubmit = vi.fn()
    render(<FormBuilder schema={schema} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await screen.findByText('Nome obrigatório')
    expect(screen.getByLabelText(/nome/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('submete os valores preenchidos', async () => {
    const onSubmit = vi.fn()
    render(<FormBuilder schema={schema} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/nome/i), 'Pão de queijo')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Pão de queijo' })
  })

  it('footer customizado: submit + cancelar com labels próprios', async () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    render(
      <FormBuilder
        schema={schema}
        onSubmit={onSubmit}
        footer={({ reset }) => (
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => {
                reset()
                onCancel()
              }}
            >
              Cancelar
            </Button>
            <Button type='submit'>Confirmar</Button>
          </div>
        )}
      />
    )
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(/nome/i), 'Brigadeiro')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Brigadeiro' })
  })

  it('footer: cancelar reseta os valores preenchidos', async () => {
    render(
      <FormBuilder
        schema={schema}
        onSubmit={vi.fn()}
        footer={({ reset }) => (
          <Button type='button' onClick={() => reset()}>
            Cancelar
          </Button>
        )}
      />
    )
    const nome = screen.getByLabelText(/nome/i)
    await userEvent.type(nome, 'Texto')
    expect(nome).toHaveValue('Texto')
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(nome).toHaveValue('')
  })
})
