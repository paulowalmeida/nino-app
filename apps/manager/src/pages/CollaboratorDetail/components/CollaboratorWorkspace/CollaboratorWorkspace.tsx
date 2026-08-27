import { useState } from 'react'

import { Dialog } from '@nino/ds/components/Dialog'
import { Tabs } from '@nino/ds/components/Tabs'
import { CollaboratorAccess } from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorAccess/CollaboratorAccess'
import { CollaboratorActivity } from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorActivity/CollaboratorActivity'
import { useCollaboratorDetailFacade } from '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'
import { EditEmailModal } from '@shared/components/EditEmailModal/EditEmailModal'
import { loginEmailOf } from '@shared/utils/login-email/login-email'

import styles from './CollaboratorWorkspace.module.css'

export const CollaboratorWorkspace = () => {
  const [isEmailModalOpen, setEmailModalOpen] = useState(false)
  const [isRemovalConfirmOpen, setRemovalConfirmOpen] = useState(false)
  const { member, ...admin } = useCollaboratorDetailFacade()

  if (!member) return null
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
                headingLevel={2}
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
                emailLockHint={admin.emailLockHint}
                onOpenEmailModal={() => setEmailModalOpen(true)}
                onOpenRemovalConfirm={() => setRemovalConfirmOpen(true)}
              />
            ),
          },
        ]}
      />

      <EditEmailModal
        open={isEmailModalOpen}
        onOpenChange={setEmailModalOpen}
        title="Editar e-mail"
        hint={`Usado por ${member.user.name} para entrar no painel.`}
        currentEmail={email}
        onSave={admin.saveEmail}
      />

      <Dialog
        open={isRemovalConfirmOpen}
        onOpenChange={setRemovalConfirmOpen}
        title="Tirar da loja"
        description={
          `${member.user.name} perde o acesso ao painel desta loja. ` +
          'O histórico de pedidos continua registrado.'
        }
        confirmLabel="Tirar da loja"
        loading={admin.isRemoving}
        onConfirm={() => void admin.confirmRemoval()}
        onCancel={() => setRemovalConfirmOpen(false)}
      />
    </>
  )
}
