import { Fragment, MouseEvent, ReactNode } from 'react'

import { Flexbox } from '@ds/components/Flexbox/Flexbox'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Breadcrumb.module.css'

type BreadcrumbItem = {
  label: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: ReactNode
  className?: string
  ariaLabel?: string
}

export function Breadcrumb({
  items,
  separator,
  className,
  ariaLabel = 'Breadcrumb',
}: BreadcrumbProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={mergeClasses(styles.trail, className)}
    >
      <Flexbox as="ol" direction="row" align="center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <li>
                <a
                  href={item.href}
                  onClick={item.onClick}
                  aria-current={isLast ? 'page' : undefined}
                  className={mergeClasses(
                    styles.link,
                    isLast ? styles.currentLink : styles.restingLink
                  )}
                >
                  {item.label}
                </a>
              </li>
              {!isLast && (
                <li aria-hidden className={styles.separator}>
                  {separator ?? <Icon name="chevron-right" size="sm" />}
                </li>
              )}
            </Fragment>
          )
        })}
      </Flexbox>
    </nav>
  )
}
