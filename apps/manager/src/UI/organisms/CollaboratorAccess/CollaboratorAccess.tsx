import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Icon } from '@nino/ds/components/Icon'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { EditEmailModal } from '@organisms/EditEmailModal/EditEmailModal'
import { TEAM_ROLE_OPTIONS } from '@constants/team.constants'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import { useCollaboratorAdmin } from '@hooks/team/useCollaboratorAdmin'
import { loginEmailOf } from '@utils/login-email'

import styles from './CollaboratorAccess.module.css'

const ROLE_REACH = TEAM_ROLE_OPTIONS.map(({ value, label, hint }) => ({
  value,
  label,
  description: hint,
}))

const ROLE_LABEL_ID = 'collaborator-role-choice'

type CollaboratorAccessProps = {
  member: StaffDetail
}

export const CollaboratorAccess = ({ member }: CollaboratorAccessProps) => {
  const admin = useCollaboratorAdmin(member)
  const email = loginEmailOf(member.user)
  const firstName = member.user.name.split(' ')[0]

  return (
    <section aria-label="Acesso" className={styles.access}>
      {!member.user.profileCompletedAt && (
        <Alert variant="warning">
          Convite ainda não aceito. {firstName} só entra no painel depois de
          criar a senha pelo link do convite.
        </Alert>
      )}

      {!member.user.isActive && (
        <Alert variant="error">
          A conta está desativada. Nem o cargo nem o e-mail abaixo dão acesso
          ao painel enquanto ela estiver assim.
        </Alert>
      )}

      <div className={styles.reach}>
        <h3 id={ROLE_LABEL_ID} className={styles.blockTitle}>
          Até onde vai nesta loja
        </h3>

        <RadioGroup
          variant="card"
          options={ROLE_REACH}
          value={member.role}
          disabled={!!admin.roleLockHint || admin.isChangingRole}
          onValueChange={(role) => admin.changeRole(role as TenantRole)}
          aria-labelledby={ROLE_LABEL_ID}
          className={styles.roleChoice}
        />

        {admin.roleLockHint && (
          <p className={styles.lockHint}>
            <Icon name="lock" size="sm" aria-hidden />
            {admin.roleLockHint}
          </p>
        )}
      </div>

      <div>
        <h3 className={styles.blockTitle}>Como entra no painel</h3>

        <div className={styles.login}>
          <p className={styles.loginEmail}>
            {email ?? 'Nenhum e-mail cadastrado'}
          </p>

          <Button variant="outline" size="sm" onClick={admin.openEmailModal}>
            Editar e-mail
          </Button>
        </div>
      </div>

      <footer className={styles.revoke}>
        <p className={styles.revokeText}>
          {firstName} perde o painel desta loja. A conta continua existindo, e
          o histórico de pedidos fica registrado.
        </p>

        <Button
          variant="ghost"
          size="sm"
          disabled={!!admin.removalLockHint}
          onClick={admin.openRemovalConfirm}
          className={styles.revokeButton}
        >
          Tirar da loja
        </Button>

        {admin.removalLockHint && (
          <p className={styles.lockHint}>
            <Icon name="lock" size="sm" aria-hidden />
            {admin.removalLockHint}
          </p>
        )}
      </footer>

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
    </section>
  )
}
