import { Dialog } from '@nino/ds/components/Dialog'
import { Tabs } from '@nino/ds/components/Tabs'
import { CollaboratorAccess } from '@organisms/CollaboratorAccess/CollaboratorAccess'
import {
  CollaboratorActivity,
  type CollaboratorActivityProps,
} from '@organisms/CollaboratorActivity/CollaboratorActivity'
import { EditEmailModal } from '@organisms/EditEmailModal/EditEmailModal'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { useCollaboratorAdmin } from '@hooks/team/useCollaboratorAdmin'
import { loginEmailOf } from '@utils/login-email'

import styles from './CollaboratorContentContainer.module.css'

type CollaboratorContentContainerProps = {
  member: StaffDetail
  activityHeadingLevel: CollaboratorActivityProps['headingLevel']
}

export const CollaboratorContentContainer = ({
  member,
  activityHeadingLevel,
}: CollaboratorContentContainerProps) => {
  const admin = useCollaboratorAdmin(member)
  const email = loginEmailOf(member.user)

  return (
    <>
      <Tabs
        className={styles.panels}
        tabs={[
          {
            value: 'activity',
            label: `Atividade · ${member.activity.length}`,
            content: (
              <CollaboratorActivity
                activity={member.activity}
                headingLevel={activityHeadingLevel}
              />
            ),
          },
          {
            value: 'access',
            label: 'Acesso',
            content: (
              <CollaboratorAccess
                member={member}
                roleLockHint={admin.roleLockHint}
                isChangingRole={admin.isChangingRole}
                onChangeRole={admin.changeRole}
                removalLockHint={admin.removalLockHint}
                onOpenEmailModal={admin.openEmailModal}
                onOpenRemovalConfirm={admin.openRemovalConfirm}
              />
            ),
          },
        ]}
      />

      <EditEmailModal
        open={admin.isEmailModalOpen}
        onOpenChange={(open) => !open && admin.closeEmailModal()}
        title="Editar e-mail"
        hint={`Usado por ${member.user.name} para entrar no painel.`}
        currentEmail={email}
        onSave={admin.saveEmail}
      />

      <Dialog
        open={admin.isRemovalConfirmOpen}
        onOpenChange={(open) => !open && admin.closeRemovalConfirm()}
        title="Tirar da loja"
        description={
          `${member.user.name} perde o acesso ao painel desta loja. ` +
          'O histórico de pedidos continua registrado.'
        }
        confirmLabel="Tirar da loja"
        loading={admin.isRemoving}
        onConfirm={() => void admin.confirmRemoval()}
        onCancel={admin.closeRemovalConfirm}
      />
    </>
  )
}
