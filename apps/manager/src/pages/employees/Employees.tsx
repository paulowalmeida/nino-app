import { useState } from 'react'

import { PageHeader } from '@nino/ds/components/PageHeader'
import { EditEmailModal } from '@compositions/EditEmailModal'
import { InviteForm } from '@compositions/InviteForm'
import { TeamRoster } from '@compositions/TeamRoster'
import type { RosterEntry } from '@compositions/TeamRoster/TeamRoster.types'
import { useCouriers } from '@hooks/team/useCouriers'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useInvite } from '@hooks/team/useInvite'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useStaff } from '@hooks/team/useStaff'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { useSessionStore } from '@states/useSessionStore'
import type { AuthUser, TenantRole } from '@custom_types/auth'

import styles from './Employees.module.css'

const ROLE_LABEL: Record<TenantRole, string> = {
  TENANT_OWNER: 'Dono',
  MANAGER: 'Gerente',
  STAFF: 'Atendente',
}

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

  const { mutate: changeRole, isPending: isChangingRole, variables: roleVars } =
    useUpdateStaffRole(tenantId)

  /* Só o dono troca cargo — a API recusa o resto, e mostrar o menu para quem
   * vai levar 403 é prometer o que não se cumpre. */
  const isOwner = tenant?.role === 'TENANT_OWNER'
  const meId = useSessionStore((state) => state.user?.id)

  const staffEntries: RosterEntry[] = (staff?.data ?? []).map(
    ({ user, role }) => ({
      id: user.id,
      name: user.name,
      email: emailOf(user),
      role: ROLE_LABEL[role],
      roleKey: role,
      roleLocked:
        user.id === meId ? 'Você não pode mudar o próprio cargo' : undefined,
      lastLoginAt: user.lastLoginAt,
      removable: role !== 'TENANT_OWNER',
      emailEditable: true,
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
      <PageHeader
        className={styles.header}
        title="Quem toca a equipe"
        accent="equipe"
        description="Cada pessoa entra com a própria conta — e o painel registra quem mexeu em cada pedido."
      />

      <div className={styles.stack}>
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
            isOwner
              ? (userId, role) => changeRole({ userId, role })
              : undefined
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
      </div>

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
