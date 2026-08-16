import { useState } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import { EditEmailModal } from '@organisms/EditEmailModal/EditEmailModal'
import { InviteForm } from '@organisms/InviteForm/InviteForm'
import { TeamRoster } from '@organisms/TeamRoster/TeamRoster'
import { useCouriers } from '@hooks/team/useCouriers'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useInvite } from '@hooks/team/useInvite'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useStaff } from '@hooks/team/useStaff'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { useSessionStore } from '@states/useSessionStore'
import { TEAM_ROLE_LABEL } from '@constants/team.constants'
import type { AuthUser } from '@custom_types/auth/auth-user'
import type { RosterEntry } from '@custom_types/team/roster-entry'

import styles from './Employees.module.css'

const emailOf = (user: AuthUser): string | null =>
  user.credentials.find(({ email }) => !!email)?.email ?? null

export const Employees = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: staff, isPending: isStaffPending } = useStaff(tenantId)
  const { data: couriers, isPending: isCourierPending } = useCouriers(tenantId)
  const { mutateAsync: invite } = useInvite(tenantId)
  const {
    mutate: removeMember,
    variables: removingVariables,
    isPending: isRemoving,
  } = useRemoveMember(tenantId)

  /* `variables` sobrevive à falha: sem o isPending o botão gira pra sempre. */
  const removing = isRemoving ? removingVariables : undefined
  const { mutateAsync: updateStaffEmail } = useUpdateStaffEmail(tenantId)

  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)

  const {
    mutate: changeRole,
    isPending: isChangingRole,
    variables: roleVars,
  } = useUpdateStaffRole(tenantId)

  /* Só o dono troca cargo — a API recusa o resto, e mostrar o menu para quem
   * vai levar 403 é prometer o que não se cumpre. */
  const isOwner = tenant?.role === 'TENANT_OWNER'
  const meId = useSessionStore((state) => state.user?.id)

  const staffEntries: RosterEntry[] = (staff?.data ?? []).map(
    ({ user, role }) => ({
      id: user.id,
      name: user.name,
      email: emailOf(user),
      role: TEAM_ROLE_LABEL[role],
      roleKey: role,
      roleLocked:
        user.id === meId ? 'Você não pode mudar o próprio cargo' : undefined,
      lastLoginAt: user.lastLoginAt,
      removable: role !== 'TENANT_OWNER',
      emailEditable: true,
      href: user.id,
    })
  )

  const editingStaff = staffEntries.find(({ id }) => id === editingStaffId)

  const courierEntries: RosterEntry[] = (couriers?.data ?? []).map(
    ({ courier, isActive }) => ({
      id: courier.id,
      name: courier.name,
      email: emailOf(courier),
      role: isActive ? 'Ativo' : 'Parado',
      lastLoginAt: courier.lastLoginAt,
      quiet: true,
      removable: true,
    })
  )

  return (
    <div className={styles.page}>
      <Header
        mb={{ mobile: 6, desktop: 8 }}
        title="Quem toca a equipe"
        accent="equipe"
        description="Cada pessoa entra com a própria conta — e o painel registra quem mexeu em cada pedido."
      />

      <Flexbox gap={{ mobile: 8, desktop: 10 }}>
        <InviteForm onInvite={invite} />

        <TeamRoster
          title="No painel"
          hint="Quem recebe, aceita e acompanha os pedidos."
          entries={staffEntries}
          empty="Só você por enquanto. Chame alguém pelo convite acima."
          isPending={isStaffPending}
          removingId={removing?.kind === 'STAFF' ? removing.id : undefined}
          onRemove={(id) => removeMember({ id, kind: 'STAFF' })}
          onEditEmail={setEditingStaffId}
          onChangeRole={
            isOwner ? (userId, role) => changeRole({ userId, role }) : undefined
          }
          changingRoleId={isChangingRole ? roleVars?.userId : undefined}
        />

        <TeamRoster
          title="Na rua"
          hint="Quem leva o pedido até a porta do cliente."
          entries={courierEntries}
          empty="Nenhum entregador cadastrado nesta loja."
          isPending={isCourierPending}
          removingId={removing?.kind === 'COURIER' ? removing.id : undefined}
          onRemove={(id) => removeMember({ id, kind: 'COURIER' })}
        />
      </Flexbox>

      <EditEmailModal
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaffId(null)}
        title="Editar e-mail"
        hint={`Usado por ${editingStaff?.name ?? ''} para entrar no painel.`}
        currentEmail={editingStaff?.email ?? null}
        onSave={(email) =>
          updateStaffEmail({ userId: editingStaff?.id ?? '', email })
        }
      />
    </div>
  )
}
