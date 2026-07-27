import { useState } from 'react'

import { Tabs as ArkTabs } from '@ark-ui/react/tabs'
import { motion } from 'framer-motion'

import { TabsProps } from './Tabs.types'

/* A physical selector, not the toast's card: the whole strip is a sunk track
 * and the active tab is the one lifted plate on it. Solid, flat, 8px — same
 * language, different object. */
const baseList =
  'relative inline-flex items-center gap-1 rounded-card bg-surface-sunk p-1'

const baseTrigger =
  'relative rounded-[6px] px-4 py-1.5 text-sm font-semibold text-subtle ' +
  'transition-all duration-200 outline-none whitespace-nowrap ' +
  'hover:text-ink focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 disabled:pointer-events-none ' +
  'disabled:opacity-40 data-[selected]:text-ink'

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
            {/* The plate itself is the indicator: it slides between tabs
                instead of a separate hairline riding under them. */}
            {active === tab.value && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-[6px] bg-white shadow-card"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{tab.label}</span>
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
