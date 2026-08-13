import type { Meta, StoryObj } from '@storybook/react'

import { Carousel } from './Carousel'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Carousel>

const slide = (label: string, color: string) => (
  <div
    style={{ height: 192, background: color }}
    className="flex w-full items-center justify-center rounded-2 text-xl font-semibold text-fg-on-brand"
  >
    {label}
  </div>
)

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <Carousel
        loop
        slides={[
          slide('Promo 1', '#FF6B00'),
          slide('Promo 2', '#1f2937'),
          slide('Promo 3', '#E8540C'),
        ]}
      />
    </div>
  ),
}
