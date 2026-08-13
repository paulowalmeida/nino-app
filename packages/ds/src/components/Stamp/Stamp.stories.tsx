import type { Meta, StoryObj } from '@storybook/react'

import { Flexbox } from '../Flexbox/Flexbox'
import { Icon } from '../Icon/Icon'
import { Text } from '../Text/Text'
import { Stamp } from './Stamp'

const meta: Meta<typeof Stamp> = {
  title: 'Components/Stamp',
  component: Stamp,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: [
        'brand',
        'brandSoft',
        'brandStrong',
        'success',
        'warning',
        'danger',
        'neutral',
        'inverse',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Stamp>

export const Default: Story = {
  render: () => (
    <Stamp>
      <Icon name="chevron-down" size="sm" />
    </Stamp>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Flexbox direction="row" align="center" gap={3}>
      <Stamp size="sm">
        <Icon name="check" size="xs" />
      </Stamp>
      <Stamp size="md">
        <Icon name="check" size="sm" />
      </Stamp>
      <Stamp size="lg">
        <Icon name="check" size="sm" />
      </Stamp>
    </Flexbox>
  ),
}

/**
 * Each tone carries surface and ink together, so a caller cannot end up with
 * light ink on a light fill.
 */
export const Tones: Story = {
  render: () => (
    <Flexbox direction="row" gap={3} wrap>
      {(
        [
          'brand',
          'brandSoft',
          'brandStrong',
          'success',
          'warning',
          'danger',
          'neutral',
          'inverse',
        ] as const
      ).map((tone) => (
        <Flexbox key={tone} align="center" gap={1}>
          <Stamp tone={tone} size="md">
            <Icon name="check" size="sm" />
          </Stamp>
          <Text size="xs" color="faint">
            {tone}
          </Text>
        </Flexbox>
      ))}
    </Flexbox>
  ),
}

/**
 * It holds a number just as well — this is the stepper's step.
 */
export const WithNumber: Story = {
  render: () => (
    <Flexbox direction="row" gap={3}>
      <Stamp size="lg" tone="inverse">
        1
      </Stamp>
      <Stamp size="lg" tone="brand">
        2
      </Stamp>
      <Stamp size="lg" tone="neutral">
        3
      </Stamp>
    </Flexbox>
  ),
}
