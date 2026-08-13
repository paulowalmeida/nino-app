import { ReactNode, useState } from 'react'

import { Tabs as ArkTabs } from '@ark-ui/react/tabs'

import styles from './Tabs.module.css'

type TabItem = {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}

type TabsProps = {
  /** Label and content of each tab, in order */
  tabs: TabItem[]
  defaultValue?: string
  /**
   * Controlled tab. Leave it out and pass `defaultValue` to let the component
   * keep its own
   */
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

/**
 * Shallow switch between views of the same subject — the same pair of states
 * as the Accordion, laid on its side: the active tab wears the brand
 * surface, the others sit as dimmed text on the rail.
 *
 * For a long screen split into independent sections, each with its own save
 * button, child routes beat tabs — the URL keeps the place, and going back
 * works. See screens.md, "Tela longa vira sub-rotas".
 *
 * ```tsx
 * <Tabs tabs={[{ value: 'day', label: 'Hoje', content: <Today /> }]} />
 * ```
 */
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

  const handleValueChange = (next: string) => {
    setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <ArkTabs.Root
      value={active}
      onValueChange={({ value }) => handleValueChange(value)}
      {...props}
    >
      <ArkTabs.List className={styles.tabBar}>
        <ArkTabs.Indicator className={styles.selectionPill} />
        {tabs.map((tab) => (
          <ArkTabs.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={styles.tab}
          >
            {tab.label}
          </ArkTabs.Trigger>
        ))}
      </ArkTabs.List>
      {tabs.map((tab) => (
        <ArkTabs.Content
          key={tab.value}
          value={tab.value}
          className={styles.panel}
        >
          {tab.content}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  )
}
