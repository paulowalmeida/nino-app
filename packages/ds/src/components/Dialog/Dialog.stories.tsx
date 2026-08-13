import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button/Button'
import { Dialog } from './Dialog'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Confirm action"
          description="Are you sure you want to continue? This action cannot be undone."
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}

export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleConfirm() {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setOpen(false)
      }, 2500)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            if (!loading) setOpen(v)
          }}
          title="Save changes"
          description="Changes will be applied immediately after confirmation."
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}

export const CustomLabels: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Delete item
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete item"
          description="The item will be permanently removed from your list."
          confirmLabel="Delete"
          cancelLabel="Keep"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}
