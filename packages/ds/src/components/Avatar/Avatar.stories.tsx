import type { Meta, StoryObj } from '@storybook/react'

import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: { fallback: 'AB' },
}

export const ComImagem: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Foto de perfil',
    fallback: 'JP',
  },
}

export const FallbackIniciais: Story = {
  args: { fallback: 'WA', size: 'lg' },
}

export const FallbackIcone: Story = {
  args: { size: 'lg' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" fallback="sm" />
      <Avatar size="md" fallback="md" />
      <Avatar size="lg" fallback="lg" />
      <Avatar size="xl" fallback="xl" />
    </div>
  ),
}

export const ComRing: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="AB" className="ring-2 ring-brand ring-offset-2" />
      <Avatar
        fallback="CD"
        size="lg"
        className="ring-2 ring-gray-300 ring-offset-2"
      />
    </div>
  ),
}
