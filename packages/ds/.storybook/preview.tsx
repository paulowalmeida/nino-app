import type { Preview } from '@storybook/react'
import { MotionConfig } from 'framer-motion'
import { createRoot } from 'react-dom/client'

import { ToastContainer } from '../src/components/Toast'

import './preview.css'

// O `toaster` é um singleton de módulo: cada <ToastContainer/> montado escuta a
// mesma store e renderiza todos os toasts. Na Docs page há uma story por bloco,
// então N containers = toasts duplicados. Montamos UM container só para todo o
// preview do Storybook, fora da renderização das stories.
if (
  typeof document !== 'undefined' &&
  !document.getElementById('sb-toast-root')
) {
  const el = document.createElement('div')
  el.id = 'sb-toast-root'
  document.body.appendChild(el)
  createRoot(el).render(<ToastContainer />)
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <MotionConfig reducedMotion="never">
        <Story />
      </MotionConfig>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Components',
          [
            'Accordion',
            'Alert',
            'Avatar',
            'Badge',
            'Breadcrumb',
            'Button',
            'Card',
            'Carousel',
            'Checkbox',
            'Clipboard',
            'CnpjInput',
            'Collapsible',
            'ColorPicker',
            'Combobox',
            'CpfInput',
            'DatePicker',
            'Dialog',
            'Drawer',
            'FileUpload',
            'FormField',
            'HoverCard',
            'Input',
            'Label',
            'Listbox',
            'LoadingDots',
            'MaskedInput',
            'Menu',
            'Modal',
            'NumberInput',
            'OTPInput',
            'PageHeader',
            'Pagination',
            'PasswordInput',
            'PhoneInput',
            'Popover',
            'ProgressCircle',
            'ProgressLine',
            'QRCode',
            'RadioGroup',
            'Rating',
            'ScrollArea',
            'Select',
            'Separator',
            'Skeleton',
            'Slider',
            'Spinner',
            'Stepper',
            'Switch',
            'Table',
            'Tabs',
            'TagsInput',
            'Textarea',
            'Toast',
            'Tooltip',
            '*',
          ],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
