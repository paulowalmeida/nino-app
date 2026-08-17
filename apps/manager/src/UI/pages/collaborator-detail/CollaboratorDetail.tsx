import { useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Tabs } from '@nino/ds/components/Tabs'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import {
  CollaboratorAccess,
} from '@organisms/CollaboratorAccess/CollaboratorAccess'
import {
  CollaboratorActivity,
} from '@organisms/CollaboratorActivity/CollaboratorActivity'
import {
  CollaboratorContact,
} from '@organisms/CollaboratorContact/CollaboratorContact'
import {
  CollaboratorHeader,
} from '@organisms/CollaboratorHeader/CollaboratorHeader'
import {
  CollaboratorSummary,
} from '@organisms/CollaboratorSummary/CollaboratorSummary'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'
import {
  CollaboratorDetailSkeleton,
} from '@skeletons/pages/CollaboratorDetailSkeleton/CollaboratorDetailSkeleton'

import styles from './CollaboratorDetail.module.css'

export const CollaboratorDetail = () => {
  const { userId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: member, isPending } = useStaffDetail(tenantId, userId as string)

  if (isPending) return <CollaboratorDetailSkeleton />

  if (!member) {
    return (
      <div className={styles.page}>
        <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />
        <EmptyState>Esta pessoa não está mais nesta loja.</EmptyState>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        trail={[{ label: 'Equipe', to: '..' }, { label: member.user.name }]}
      />

      <CollaboratorHeader member={member} />

      <CollaboratorSummary member={member} />

      <CollaboratorContact member={member} />

      <Tabs
        className={styles.panels}
        tabs={[
          {
            value: 'activity',
            label: `Atividade · ${member.activity.length}`,
            content: <CollaboratorActivity activity={member.activity} />,
          },
          {
            value: 'access',
            label: 'Acesso',
            content: <CollaboratorAccess member={member} />,
          },
        ]}
      />
    </div>
  )
}
