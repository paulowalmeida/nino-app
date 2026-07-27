import { useState } from 'react'

import { Tabs as ArkTabs } from '@ark-ui/react/tabs'
import { motion } from 'framer-motion'

import { TabsProps } from './Tabs.types'

/* O mesmo par de estados do Accordion, deitado: a aba ativa veste a superfície
 * de marca, as demais ficam em texto apagado sobre o trilho. Placa branca com
 * sombra era o segmented control de qualquer app; aqui o que marca a posição é
 * a tinta da casa. */
const baseList =
  'relative inline-flex items-center gap-0.5 rounded-card bg-surface-mute p-1'

const baseTrigger =
  'relative cursor-pointer rounded-[6px] px-4 py-1.5 text-sm font-semibold ' +
  'text-subtle transition-colors duration-200 outline-none whitespace-nowrap ' +
  'hover:text-ink focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:-outline-offset-2 disabled:pointer-events-none ' +
  'disabled:opacity-40 data-[selected]:text-brand-strong'

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
            {/* A própria superfície é o indicador: ela desliza de uma aba
                para a outra em vez de um fio correndo por baixo. */}
            {active === tab.value && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-[6px] bg-brand-soft"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
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
