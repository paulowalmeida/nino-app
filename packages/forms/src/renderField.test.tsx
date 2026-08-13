import { maskZipCode } from '@nino/ds/masks'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import { renderField } from './renderField'
import { FieldConfig } from './types'

const FieldHarness = ({
  field,
  error,
}: {
  field: FieldConfig
  error?: string
}) => {
  const { control } = useForm()

  return (
    <form>{renderField(field, control as Control<FieldValues>, error)}</form>
  )
}

describe(renderField.name, () => {
  it('renders a text field as an input carrying its placeholder', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'name',
      type: 'text',
      label: 'Nome',
      placeholder: 'Seu nome',
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByLabelText('Nome')).toHaveAttribute(
      'placeholder',
      'Seu nome'
    )
  })

  it('renders a textarea for the textarea type', () => {
    // Arrange
    const field: FieldConfig = { name: 'bio', type: 'textarea', label: 'Bio' }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA')
  })

  it('starts a text field controlled even with no default value', () => {
    // Arrange
    const field: FieldConfig = { name: 'name', type: 'text', label: 'Nome' }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })

  it('renders a select with the options it was given', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'category',
      type: 'select',
      label: 'Categoria',
      options: [{ value: 'drinks', label: 'Bebidas' }],
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByText('Categoria')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders a checkbox for the checkbox type', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'agreed',
      type: 'checkbox',
      label: 'Aceito',
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByRole('checkbox', { name: 'Aceito' })).toBeInTheDocument()
  })

  it('renders a switch for the switch type', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'active',
      type: 'switch',
      label: 'Ativo',
    }

    // Act
    const { container } = render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByRole('checkbox', { name: 'Ativo' })).toBeInTheDocument()
    expect(container.querySelector('[data-scope="switch"]')).toBeInTheDocument()
  })

  it('puts the label beside the control for a switch', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'active',
      type: 'switch',
      label: 'Ativo',
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    const label = screen.getByText('Ativo')
    expect(label.parentElement?.lastElementChild).toBe(label)
  })

  it('shows the helper text under the control', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'name',
      type: 'text',
      label: 'Nome',
      helperText: 'Como aparece no cardápio',
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByText('Como aparece no cardápio')).toBeInTheDocument()
  })

  it('replaces the helper text with the error and flags the control', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'name',
      type: 'text',
      label: 'Nome',
      helperText: 'Como aparece no cardápio',
    }

    // Act
    render(<FieldHarness field={field} error="Obrigatório" />)

    // Assert
    expect(screen.getByText('Obrigatório')).toBeInTheDocument()
    expect(screen.queryByText('Como aparece no cardápio')).toBeNull()
    expect(screen.getByLabelText('Nome')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('formats a cpf field while it is typed', async () => {
    // Arrange
    const field: FieldConfig = { name: 'cpf', type: 'cpf', label: 'CPF' }
    render(<FieldHarness field={field} />)

    // Act
    await userEvent.type(screen.getByLabelText('CPF'), '52998224725')

    // Assert
    expect(screen.getByLabelText('CPF')).toHaveValue('529.982.247-25')
  })

  it('formats a cnpj field while it is typed', async () => {
    // Arrange
    const field: FieldConfig = { name: 'cnpj', type: 'cnpj', label: 'CNPJ' }
    render(<FieldHarness field={field} />)

    // Act
    await userEvent.type(screen.getByLabelText('CNPJ'), '11222333000181')

    // Assert
    expect(screen.getByLabelText('CNPJ')).toHaveValue('11.222.333/0001-81')
  })

  it('formats a phone field, settling on the ninth digit', async () => {
    // Arrange
    const field: FieldConfig = {
      name: 'phone',
      type: 'phone',
      label: 'Telefone',
    }
    render(<FieldHarness field={field} />)

    // Act
    await userEvent.type(screen.getByLabelText('Telefone'), '11987654321')

    // Assert
    expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 98765-4321')
  })

  it('applies the mask a generic masked field was given', async () => {
    // Arrange
    const field: FieldConfig = {
      name: 'zipCode',
      type: 'mask',
      label: 'CEP',
      mask: maskZipCode,
    }
    render(<FieldHarness field={field} />)

    // Act
    await userEvent.type(screen.getByLabelText('CEP'), '01310930')

    // Assert
    expect(screen.getByLabelText('CEP')).toHaveValue('01310-930')
  })

  it('hides what is typed in a password field until it is revealed', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'password',
      type: 'password',
      label: 'Senha',
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('carries the bounds of a number field to the control', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'quantity',
      type: 'number',
      label: 'Quantidade',
      min: 1,
      max: 10,
      step: 2,
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    const input = screen.getByLabelText('Quantidade')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('step', '2')
  })

  it('renders every radio option, description included on card', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'delivery',
      type: 'radio',
      label: 'Entrega',
      variant: 'card',
      options: [
        { value: 'now', label: 'Agora', description: 'Em até 40 min' },
        { value: 'later', label: 'Agendar' },
      ],
    }

    // Act
    render(<FieldHarness field={field} />)

    // Assert
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByText('Em até 40 min')).toBeInTheDocument()
  })

  it('renders a date field with its placeholder', () => {
    // Arrange
    const field: FieldConfig = {
      name: 'openedAt',
      type: 'date',
      label: 'Abertura',
    }

    // Act
    const { container } = render(<FieldHarness field={field} />)

    // Assert
    expect(container.querySelector('input')).toHaveAttribute(
      'placeholder',
      'dd/mm/aaaa'
    )
  })

  it('renders a field with no label at all', () => {
    // Arrange
    const field: FieldConfig = { name: 'name', type: 'text' }

    // Act
    const { container } = render(<FieldHarness field={field} />)

    // Assert
    expect(container.querySelector('label')).toBeNull()
    expect(container.querySelector('input')).toBeInTheDocument()
  })
})
