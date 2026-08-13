import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '../Label/Label'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex items-center gap-3">
        <Switch
          {...args}
          id="switch-default"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="switch-default">
          {checked ? 'Ativado' : 'Desativado'}
        </Label>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Switch size={size} defaultChecked />
          <Label>{size}</Label>
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch disabled />
        <Label>Desabilitado (off)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled defaultChecked />
        <Label>Desabilitado (on)</Label>
      </div>
    </div>
  ),
}
