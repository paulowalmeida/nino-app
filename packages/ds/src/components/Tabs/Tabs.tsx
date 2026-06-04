import { useState } from 'react'

import { Tabs as ArkTabs } from '@ark-ui/react/tabs'
import { motion } from 'framer-motion'

import { TabsProps } from './Tabs.types'

const baseList = 'relative flex items-center border-b border-gray-200'

const baseTrigger =
  'relative px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors duration-200 outline-none whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40 data-[selected]:text-brand'

const baseContent = 'mt-4 outline-none'

export function Tabs({
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  ...props
}: TabsProps) {
  const initial = defaultValue ?? controlledValue ?? tabs[0]?.value
  const [internalValue, setInternalValue] = useState(initial)
  const active = controlledValue ?? internalValue

  function handleValueChange(v: string) {
    setInternalValue(v)
    onValueChange?.(v)
  }

  return (
    <ArkTabs.Root
      value={active}
      onValueChange={({ value }) => handleValueChange(value)}
      {...props}
    >
      <ArkTabs.List className={baseList}>
        {tabs.map((tab) => (
          <ArkTabs.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={baseTrigger}
          >
            {tab.label}
            {active === tab.value && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </ArkTabs.Trigger>
        ))}
      </ArkTabs.List>
      {tabs.map((tab) => (
        <ArkTabs.Content
          key={tab.value}
          value={tab.value}
          className={baseContent}
        >
          {tab.content}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  )
}
