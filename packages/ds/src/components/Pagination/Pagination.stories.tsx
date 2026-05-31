import type { Meta, StoryObj } from '@storybook/react'

import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { count: 100, pageSize: 10 },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {}

export const ComMuitasPaginas: Story = {
  args: { count: 500, pageSize: 10, defaultPage: 7 },
}

export const PoucasPaginas: Story = {
  args: { count: 30, pageSize: 10 },
}
