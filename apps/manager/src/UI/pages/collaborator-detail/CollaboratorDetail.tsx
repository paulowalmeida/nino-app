import { useParams } from 'react-router'

import { CollaboratorActivity } from '@organisms/CollaboratorActivity/CollaboratorActivity'
import { CollaboratorFacts } from '@organisms/CollaboratorFacts/CollaboratorFacts'
import { CollaboratorHeader } from '@organisms/CollaboratorHeader/CollaboratorHeader'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'

import { Eyebrow } from '@ds/components/Eyebrow/Eyebrow'
import { Flexbox } from '@ds/components/Flexbox/Flexbox'
import styles from './CollaboratorDetail.module.css'

export const CollaboratorDetail = () => {
  const { userId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: member, isPending } = useStaffDetail(tenantId, userId as string)

  if (isPending) return <Skeleton className={styles.skeleton} />

  if (!member) {
    return (
      <Flexbox className={styles.page}>
        <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />
        <EmptyState className={styles.empty}>
          Esta pessoa não está mais nesta loja.
        </EmptyState>
      </Flexbox>
    )
  }

  return (
    <Flexbox className={styles.page}>
      <Breadcrumb
        trail={[{ label: 'Equipe', to: '..' }, { label: member.user.name }]}
      />

      <Eyebrow>Equipe</Eyebrow>

      <CollaboratorHeader member={member} />

      <Flexbox className={styles.body}>
        <CollaboratorFacts member={member} />
        <CollaboratorActivity activity={member.activity} />
      </Flexbox>
    </Flexbox>
  )
}
