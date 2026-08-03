import { Fragment, MouseEvent, ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  className?: string
  ariaLabel?: string
}

const baseNav = 'flex items-center text-sm'

const baseLink =
  'inline-flex h-11 items-center text-subtle transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded'

const activeLinkClass = 'text-ink font-medium pointer-events-none'

const separatorClass = 'mx-2 text-faint select-none'

const DefaultSeparator = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export function Breadcrumb({
  items,
  separator,
  className,
  ariaLabel = 'Breadcrumb',
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={mergeClasses(baseNav, className)}>
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <li>
                <a
                  href={item.href}
                  onClick={item.onClick}
                  aria-current={isLast ? 'page' : undefined}
                  className={mergeClasses(baseLink, isLast && activeLinkClass)}
                >
                  {item.label}
                </a>
              </li>
              {!isLast && (
                <li aria-hidden className={separatorClass}>
                  {separator ?? <DefaultSeparator />}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
