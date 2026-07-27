import { mergeClasses } from '@ds/lib/mergeClasses'

import { PageHeaderProps } from './PageHeader.types'

/* Sem fio embaixo: o respiro separa o cabeçalho do conteúdo, e a régua a
 * mais só some no meio das superfícies rebaixadas da página. */
const baseRoot = 'flex flex-col gap-3 pb-5'

const titleClass = 'font-display text-2xl font-bold tracking-[-0.02em] text-ink'

const descriptionClass = 'mt-1 text-sm text-subtle'

/**
 * Page heading with title, optional description, breadcrumb and actions.
 * Pure composition — no Ark primitive.
 *
 * @param title - Main page title
 *
 * @param actions - Right-aligned actions (buttons, menus)
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={mergeClasses(baseRoot, className)}>
      {breadcrumb}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={titleClass}>{title}</h1>
          {description && <p className={descriptionClass}>{description}</p>}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}

PageHeader.displayName = 'PageHeader'
