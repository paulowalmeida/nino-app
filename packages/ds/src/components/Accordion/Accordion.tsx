import { ReactNode } from 'react'

import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { AccordionItem } from '../AccordionItem/AccordionItem'
import styles from './Accordion.module.css'

type AccordionEntry = {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

type AccordionProps = {
  items: AccordionEntry[]
  /** Allows multiple items to be open at the same time */
  multiple?: boolean
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  className?: string
  /** Classes extras por item — para superfícies com tema próprio (ex.: dark). */
  itemClassName?: string
  /** Classes extras por trigger — para superfícies com tema próprio. */
  triggerClassName?: string
  /** Classes extras por painel de conteúdo — para tema próprio. */
  contentClassName?: string
}

export function Accordion({
  items,
  multiple = false,
  defaultValue,
  value,
  onValueChange,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: AccordionProps) {
  return (
    <ArkAccordion.Root
      multiple={multiple}
      collapsible
      defaultValue={defaultValue}
      value={value}
      onValueChange={({ value: v }) => onValueChange?.(v)}
      className={mergeClasses(styles.item, className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          content={item.content}
          trigger={item.trigger}
          contentClassName={contentClassName}
          itemClassName={itemClassName}
          triggerClassName={triggerClassName}
        />
      ))}
    </ArkAccordion.Root>
  )
}
