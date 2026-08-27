import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './CollaboratorDetailSkeleton.module.css'

const GHOST_FACTS = ['revenue', 'orders', 'changes']
const GHOST_CONTACT_ACTIONS = ['phone', 'email']
const GHOST_TABS = ['activity', 'access']
const GHOST_ENTRIES = ['first', 'second', 'third', 'fourth', 'fifth']

export const CollaboratorDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />

    <p role="status" className="sr-only">
      Carregando colaborador
    </p>

    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={styles.hero}
    >
      <Skeleton variant="circle" className={styles.mark} />

      <div className={styles.heroText}>
        <Skeleton className={styles.eyebrow} />
        <Skeleton className={styles.name} />
        <Skeleton className={styles.cadence} />
      </div>
    </Box>

    <section aria-label="Resumo do trabalho" className={styles.strip}>
      <dl className={styles.facts}>
        {GHOST_FACTS.map((fact) => (
          <div key={fact} className={styles.fact}>
            <Skeleton className={styles.factLabel} />
            <Skeleton className={styles.factValue} />
          </div>
        ))}
      </dl>

      <div className={styles.footnote}>
        <Skeleton className={styles.footnoteBar} />
      </div>
    </section>

    <div className={styles.contact}>
      <div className={styles.actions}>
        {GHOST_CONTACT_ACTIONS.map((action) => (
          <Skeleton key={action} className={styles.action} />
        ))}
      </div>
    </div>

    <div className={styles.panels}>
      <Box direction="row" gap={2}>
        {GHOST_TABS.map((tab) => (
          <Skeleton key={tab} className={styles.tab} />
        ))}
      </Box>

      <ul className={styles.entries}>
        {GHOST_ENTRIES.map((entry) => (
          <li key={entry} className={styles.entry}>
            <div className={styles.entryRow}>
              <Skeleton className={styles.entryTicket} />
              <Skeleton className={styles.entryCustomer} />
              <Skeleton className={styles.entryTotal} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
