import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Stepper } from './Stepper'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

const steps = [
  { title: 'Personal info', description: 'Name and ID' },
  { title: 'Address', description: 'Delivery location' },
  { title: 'Payment', description: 'Method and details' },
  { title: 'Confirmation' },
]

export const Default: Story = {
  render: () => {
    const [step, setStep] = useState(1)
    return (
      <div className='w-full max-w-2xl space-y-6'>
        <Stepper steps={steps} step={step} onStepChange={setStep} />
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    )
  },
}

export const Vertical: Story = {
  render: () => {
    const [step, setStep] = useState(0)
    return (
      <div className='max-w-xs space-y-4'>
        <Stepper
          steps={steps}
          step={step}
          onStepChange={setStep}
          orientation='vertical'
        />
      </div>
    )
  },
}
