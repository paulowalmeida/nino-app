import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { toast, ToastContainer } from './Toast'
import type { ToastPlacement, ToastVariant } from './Toast.types'

const placements: ToastPlacement[] = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
]

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/Toast',
  component: ToastContainer,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: placements,
      description: 'Corner the stack docks to',
    },
    duration: {
      control: { type: 'number', step: 500 },
      description: 'Milliseconds on screen (Infinity keeps it until dismissed)',
    },
    max: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Visible at once; the rest queue',
    },
    gap: { control: 'number', description: 'Pixels between expanded cards' },
    offset: { control: 'text', description: 'Distance from the viewport edge' },
    overlap: {
      control: 'boolean',
      description: 'Collapse into a deck that fans open on hover',
    },
    pauseOnPageIdle: {
      control: 'boolean',
      description: 'Hold timers while the tab is in the background',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-4 p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ToastContainer>

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast.default('Order #4821 updated')}>
      Show default
    </Button>
  ),
}

/**
 * The controls below are the settings `ToastContainer` takes as props. The
 * Storybook preview mounts a single container outside the stories, so this
 * story pushes the same settings through `toast.configure`.
 */
export const Playground: Story = {
  args: {
    placement: 'bottom-end',
    duration: 4200,
    max: 4,
    gap: 12,
    offset: '1.25rem',
    overlap: true,
    pauseOnPageIdle: true,
  },
  render: ({ className: _className, ...settings }) => (
    <Button
      onClick={() => {
        toast.configure(settings)
        toast.success('Order confirmed', 'Order #1234 is now in the kitchen.')
      }}
    >
      Show with these settings
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success('Order confirmed', 'Order #1234 is now in the kitchen.')
      }
    >
      Show success
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Menu did not save', 'The connection dropped mid-save.')
      }
    >
      Show error
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.warning('Photo did not upload', 'The item was created anyway.')
      }
    >
      Show warning
    </Button>
  ),
}

/** A toast that carries the next step instead of describing it. */
export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.error('Menu did not save', {
          description: 'The connection dropped mid-save.',
          duration: 10000,
          action: {
            label: 'Save again',
            onClick: () => toast.success('Menu saved'),
          },
        })
      }
    >
      Show toast with an action
    </Button>
  ),
}

/** Stays put until something replaces it — no timer bar is drawn. */
export const Persistent: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.warning('Store is offline', {
          description: 'New orders are not coming through.',
          duration: Infinity,
        })
      }
    >
      Show persistent toast
    </Button>
  ),
}

/** One card that becomes its own outcome. */
export const PromiseToast: Story = {
  name: 'Promise',
  render: () => (
    <Button
      onClick={() =>
        toast.promise(
          new Promise<void>((resolve) => setTimeout(resolve, 2200)),
          {
            loading: 'Publishing menu',
            success: 'Menu is live',
            error: 'Menu did not publish',
          }
        )
      }
    >
      Publish menu
    </Button>
  ),
}

/** Every corner is available per call, not just per app. */
export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-2">
      {placements.map((placement) => (
        <Button
          key={placement}
          variant="outline"
          onClick={() => toast.default(placement, { placement })}
        >
          {placement}
        </Button>
      ))}
    </div>
  ),
}

/**
 * Four at once: they collapse into a deck and fan open on hover, and each
 * timer pauses while the pointer is over the stack.
 */
export const Stacked: Story = {
  render: () => (
    <Button
      onClick={() => {
        toast.success('Store closed', 'Orders resume at 2pm.')
        toast.error('Item order rolled back', 'Drag it again.')
        toast.warning('Photo did not upload', 'Send it again from the menu.')
        toast.default('Order #4821 updated')
      }}
    >
      Show a full stack
    </Button>
  ),
}

/**
 * The five states side by side, kept on screen for reviewing colour and
 * contrast. Expands the deck and drops the timers so nothing disappears
 * mid-review; the other stories keep the real defaults.
 */
export const EveryState: Story = {
  render: () => (
    <Button
      onClick={() => {
        toast.configure({ overlap: false, max: 5 })
        toast.success('Order confirmed', {
          description: 'Order #1234 is now in the kitchen.',
          duration: Infinity,
        })
        toast.error('Menu did not save', {
          description: 'The connection dropped mid-save.',
          duration: Infinity,
        })
        toast.warning('Photo did not upload', {
          description: 'The item was created anyway.',
          duration: Infinity,
        })
        toast.default('Order #4821 updated', {
          description: 'Delivery moved to 8:40pm.',
          duration: Infinity,
        })
        toast.loading('Publishing menu')
      }}
    >
      Show every state
    </Button>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        ['default', 'success', 'error', 'warning', 'loading'] as ToastVariant[]
      ).map((variant) => (
        <Button
          key={variant}
          variant="outline"
          onClick={() =>
            toast[variant](variant.charAt(0).toUpperCase() + variant.slice(1))
          }
        >
          {variant}
        </Button>
      ))}
    </div>
  ),
}
