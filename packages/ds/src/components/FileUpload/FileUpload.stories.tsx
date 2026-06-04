import type { Meta, StoryObj } from '@storybook/react'

import { FileUpload } from './FileUpload'

const ptBR = {
  triggerLabel: 'Clique para enviar',
  dragLabel: 'ou arraste e solte',
  dropLabel: 'Solte aqui',
  removeLabel: 'Remover arquivo',
}

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: ptBR,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {}

export const ImageOnly: Story = {
  args: {
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFileSize: 5 * 1024 * 1024,
  },
}

export const MultipleFiles: Story = {
  args: {
    maxFiles: 5,
    maxFileSize: 2 * 1024 * 1024,
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
