import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'inverse',
        'inverseOutline',
        'danger',
        'warning',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    loadingIndicator: { control: 'select', options: ['spinner', 'dots'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Confirm order' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'View details' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Dismiss' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Remover' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pausar loja' },
}

export const LoadingSpinner: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingIndicator: 'spinner',
    children: 'Saving...',
  },
}

export const LoadingDots: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingIndicator: 'dots',
    children: 'Saving...',
  },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Unavailable' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
    </div>
  ),
}

export const IconSize: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon" variant="ghost" aria-label="Fechar">
        ×
      </Button>
      <Button size="icon" variant="outline" aria-label="Adicionar">
        +
      </Button>
    </div>
  ),
}

/**
 * Variantes para superfícies de marca (ex.: hero laranja da landing).
 * Renderizadas sobre fundo brand para fazer sentido.
 */
export const OnBrandSurface: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-brand p-8">
      <Button variant="inverse">Criar minha loja grátis</Button>
      <Button variant="inverseOutline">Entrar</Button>
    </div>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="/menu">View menu</a>
    </Button>
  ),
}
