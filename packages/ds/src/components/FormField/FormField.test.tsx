import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from '../Input/Input'
import { Switch } from '../Switch/Switch'
import { FormField } from './FormField'
import styles from './FormField.module.css'

describe(FormField.name, () => {
  it('renders the label when provided', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders helperText when provided', () => {
    render(
      <FormField helperText="Use seu email corporativo">
        <Input />
      </FormField>
    )
    expect(screen.getByText('Use seu email corporativo')).toBeInTheDocument()
  })

  it('renders error and hides helperText when both are passed', () => {
    render(
      <FormField helperText="Texto de ajuda" error="Campo obrigatório">
        <Input />
      </FormField>
    )
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    expect(screen.queryByText('Texto de ajuda')).not.toBeInTheDocument()
  })

  it('shows the required indicator when required is true', () => {
    render(
      <FormField label="Nome" required>
        <Input />
      </FormField>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show the required indicator when required is false', () => {
    render(
      <FormField label="Nome">
        <Input />
      </FormField>
    )
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <FormField>
        <Input placeholder="Digite aqui" />
      </FormField>
    )
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
  })

  it('does not render label when not provided', () => {
    render(
      <FormField>
        <Input />
      </FormField>
    )
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('horizontal orientation places label and control on the same line', () => {
    const { container } = render(
      <FormField label="Ativo" orientation="horizontal">
        <Switch aria-label="ativo" />
      </FormField>
    )
    const row = container.querySelector(`.${styles.horizontalRow}`)
    expect(row).toBeInTheDocument()
    expect(row).toHaveTextContent('Ativo')
    expect(row?.querySelector('[data-part="control"]')).toBeInTheDocument()
  })

  it('vertical orientation (default) does not use a horizontal row', () => {
    const { container } = render(
      <FormField label="Email">
        <Input />
      </FormField>
    )
    expect(
      container.querySelector(`.${styles.horizontalRow}`)
    ).not.toBeInTheDocument()
  })
})
