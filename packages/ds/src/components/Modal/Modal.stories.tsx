import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          header={
            <h2 className="text-lg font-semibold text-gray-900">Modal title</h2>
          }
          body={
            <p className="text-sm text-gray-600">
              Modal body. Add forms, information, or any relevant content here.
            </p>
          }
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        />
      </>
    )
  },
}

export const WithoutFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          header={
            <h2 className="text-lg font-semibold text-gray-900">
              Header and body only
            </h2>
          }
          body={
            <p className="text-sm text-gray-600">
              Modal without footer for informational use cases.
            </p>
          }
        />
      </>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null)
    return (
      <>
        <div className="flex gap-3">
          <Button size="sm" onClick={() => setSize('sm')}>
            Small
          </Button>
          <Button size="sm" onClick={() => setSize('md')}>
            Medium
          </Button>
          <Button size="sm" onClick={() => setSize('lg')}>
            Large
          </Button>
        </div>
        <Modal
          open={!!size}
          onOpenChange={() => setSize(null)}
          size={size ?? 'md'}
          header={
            <h2 className="text-lg font-semibold text-gray-900">
              Size: {size}
            </h2>
          }
          body={
            <p className="text-sm text-gray-600">Modal with size {size}.</p>
          }
          footer={<Button onClick={() => setSize(null)}>Close</Button>}
        />
      </>
    )
  },
}
