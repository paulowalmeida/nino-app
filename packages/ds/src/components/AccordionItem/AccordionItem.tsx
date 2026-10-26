import { ReactNode } from 'react'

import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { DisclosureSeal } from '@ds/components/DisclosureSeal/DisclosureSeal'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './AccordionItem.module.css'

type AccordionItemProp = {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
  triggerClassName?: string
  itemClassName?: string
  contentClassName?: string
}

export function AccordionItem({
  value,
  disabled,
  content,
  trigger,
  itemClassName,
  triggerClassName,
  contentClassName,
}: AccordionItemProp) {
  return (
    <ArkAccordion.Item
      key={value}
      value={value}
      disabled={disabled}
      className={mergeClasses(styles.item, itemClassName ?? '')}
    >
      <ArkAccordion.ItemTrigger
        className={mergeClasses('group', styles.toggleHeader, triggerClassName)}
      >
        {trigger}
        <DisclosureSeal />
      </ArkAccordion.ItemTrigger>

      <ArkAccordion.ItemContent
        className={mergeClasses(
          'accordion-content',
          styles.panel,
          contentClassName
        )}
      >
        <div className={styles.panelBody}>{content}</div>
      </ArkAccordion.ItemContent>
    </ArkAccordion.Item>
  )
}
