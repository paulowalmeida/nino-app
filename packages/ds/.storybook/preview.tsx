import type { Preview } from '@storybook/react'
import { MotionConfig } from 'framer-motion'
import { createRoot } from 'react-dom/client'

import { ToastContainer } from '../src/components/Toast/Toast'

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
            'BackLink',
            'Badge',
            'BarList',
            'Breadcrumb',
            'Button',
            'Card',
            'Carousel',
            'Checkbox',
            'Chip',
            'Clipboard',
            'CnpjInput',
            'Collapsible',
            'ColorPicker',
            'Combobox',
            'CountUp',
            'CpfInput',
            'DatePicker',
            'Dialog',
            'DisclosureSeal',
            'Drawer',
            'EmptyState',
            'Eyebrow',
            'FileUpload',
            'Flexbox',
            'FormField',
            'Grid',
            'Header',
            'Heading',
            'HoverCard',
            'Icon',
            'Input',
            'Label',
            'Listbox',
            'ListRow',
            'LoadingDots',
            'MaskedInput',
            'Menu',
            'Modal',
            'NinoLogo',
            'NinoMascot',
            'NumberInput',
            'OTPInput',
            'Pagination',
            'PasswordInput',
            'PasswordStrength',
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
            'Sparkline',
            'Spinner',
            'Stamp',
            'Stepper',
            'Switch',
            'Table',
            'Tabs',
            'TagsInput',
            'Text',
            'Textarea',
            'TimePicker',
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
