import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'

import activityStyles from
  '@organisms/CollaboratorActivity/CollaboratorActivity.module.css'
import contactStyles from
  '@organisms/CollaboratorContact/CollaboratorContact.module.css'
import headerStyles from
  '@organisms/CollaboratorHeader/CollaboratorHeader.module.css'
import summaryStyles from
  '@organisms/CollaboratorSummary/CollaboratorSummary.module.css'
import styles from '@pages/collaborator-detail/CollaboratorDetail.module.css'

const GHOST_FACTS = ['revenue', 'orders', 'changes']
const GHOST_CONTACT_ACTIONS = ['phone', 'email']
const GHOST_TABS = ['activity', 'access']
const GHOST_ENTRIES = ['first', 'second', 'third', 'fourth', 'fifth']

export const CollaboratorDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />

    <Flexbox
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={headerStyles.hero}
    >
      <Skeleton variant="circle" className={headerStyles.mark} />

      <div className={headerStyles.heroText}>
        <Skeleton className={styles.ghostEyebrow} />
        <Skeleton className={styles.ghostName} />
        <Skeleton className={styles.ghostCadence} />
      </div>
    </Flexbox>

    <section aria-label="Resumo do trabalho" className={summaryStyles.strip}>
      <dl className={summaryStyles.facts}>
        {GHOST_FACTS.map((fact) => (
          <div key={fact} className={summaryStyles.fact}>
            <Skeleton className={styles.ghostFactLabel} />
            <Skeleton className={styles.ghostStripValue} />
          </div>
        ))}
      </dl>

      <div className={summaryStyles.footnote}>
        <Skeleton className={styles.ghostFootnote} />
      </div>
    </section>

    <div className={contactStyles.contact}>
      <div className={contactStyles.actions}>
        {GHOST_CONTACT_ACTIONS.map((action) => (
          <Skeleton key={action} className={styles.ghostContactAction} />
        ))}
      </div>
    </div>

    <div className={styles.panels}>
      <Flexbox direction="row" gap={2}>
        {GHOST_TABS.map((tab) => (
          <Skeleton key={tab} className={styles.ghostTab} />
        ))}
      </Flexbox>

      <ul className={activityStyles.entries}>
        {GHOST_ENTRIES.map((entry) => (
          <li key={entry} className={activityStyles.entry}>
            <div className={styles.ghostEntry}>
              <Skeleton className={styles.ghostEntryTicket} />
              <Skeleton className={styles.ghostEntryCustomer} />
              <Skeleton className={styles.ghostEntryTotal} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
