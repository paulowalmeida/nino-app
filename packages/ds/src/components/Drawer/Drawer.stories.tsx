import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button/Button'
import { Drawer } from './Drawer'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Order details"
          description="Order #1234 — Ana Lima"
        >
          <p className="text-sm text-gray-600">
            Drawer content appears here. It can contain forms, lists, or any
            other content.
          </p>
        </Drawer>
      </>
    )
  },
}

/** `contentClassName` para apps com tema próprio (ex.: fundo quente). */
export const ThemedContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open themed drawer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          title="Sua sacola"
          contentClassName="rounded-t-3xl bg-orange-50"
        >
          <p className="text-sm text-gray-600">1 item — R$ 12,00</p>
        </Drawer>
      </>
    )
  },
}

export const LeftPlacement: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open left drawer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          placement="left"
          title="Side menu"
        >
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Dashboard</li>
            <li>Orders</li>
            <li>Menu</li>
            <li>Settings</li>
          </ul>
        </Drawer>
      </>
    )
  },
}
