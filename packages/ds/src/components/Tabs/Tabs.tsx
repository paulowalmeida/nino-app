import { ReactNode, useState } from 'react'

import { Tabs as ArkTabs } from '@ark-ui/react/tabs'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import {
  Responsive,
  responsiveToClasses,
} from '@ds/lib/responsive/responsive'

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
  /**
   * Stretches the rail to the full width and splits it evenly between the
   * tabs. Default: `false` — the rail hugs its tabs. Accepts `{ mobile,
   * tablet, desktop }`
   */
  fullWidth?: Responsive<boolean>
  className?: string
}

type RailWidth = 'fill' | 'fit'

const railWidthMobile: Record<RailWidth, string> = {
  fill: styles.fill,
  fit: '',
}

const railWidthTablet: Record<RailWidth, string> = {
  fill: styles.fillTablet,
  fit: styles.fitTablet,
}

const railWidthDesktop: Record<RailWidth, string> = {
  fill: styles.fillDesktop,
  fit: styles.fitDesktop,
}

const toRailWidth = (fullWidth?: boolean): RailWidth | undefined => {
  if (fullWidth === undefined) return undefined
  return fullWidth ? 'fill' : 'fit'
}

const railWidthClasses = (fullWidth: Responsive<boolean>) => {
  const railWidth =
    typeof fullWidth === 'boolean'
      ? toRailWidth(fullWidth)
      : {
          mobile: toRailWidth(fullWidth.mobile),
          tablet: toRailWidth(fullWidth.tablet),
          desktop: toRailWidth(fullWidth.desktop),
        }

  return responsiveToClasses(
    railWidth,
    railWidthMobile,
    railWidthDesktop,
    railWidthTablet
  )
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
 * <Tabs fullWidth={{ mobile: true, tablet: false }} tabs={tabs} />
 * ```
 */
export function Tabs({
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  fullWidth = false,
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
      <ArkTabs.List
        className={mergeClasses(styles.tabBar, railWidthClasses(fullWidth))}
      >
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
