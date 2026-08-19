import { useState } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import {
  courierRosterEntries,
  staffRosterEntries,
} from '@adapters/team-roster.adapter'
import { EditEmailModal } from '@organisms/EditEmailModal/EditEmailModal'
import { InviteForm } from '@organisms/InviteForm/InviteForm'
import { TeamRoster } from '@organisms/TeamRoster/TeamRoster'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCouriers } from '@hooks/team/useCouriers'
import { useInvite } from '@hooks/team/useInvite'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useStaff } from '@hooks/team/useStaff'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Employees.module.css'

export const Employees = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const { data: staff, isPending: isStaffPending } = useStaff(tenantId)
  const { data: couriers, isPending: isCourierPending } = useCouriers(tenantId)
  const { mutateAsync: invite } = useInvite(tenantId)
  const { mutateAsync: updateStaffEmail } = useUpdateStaffEmail(tenantId)
  const {
    mutate: removeMember,
    variables: removingVariables,
    isPending: isRemoving,
  } = useRemoveMember(tenantId)
  const {
    mutate: changeRole,
    isPending: isChangingRole,
    variables: roleVars,
  } = useUpdateStaffRole(tenantId)
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const meId = useSessionStore((state) => state.user?.id)
  const staffEntries = staffRosterEntries(staff?.data ?? [], meId)
  const courierEntries = courierRosterEntries(couriers?.data ?? [])
  const editingStaff = staffEntries.find(({ id }) => id === editingStaffId)
  const removing = isRemoving ? removingVariables : undefined
  const canChangeRole = tenant?.role === 'TENANT_OWNER'

  return (
    <div className={styles.page}>
      <Header
        mb={{ mobile: 6, desktop: 8 }}
        title="Quem toca a equipe"
        accent="equipe"
        description={
          'Cada pessoa entra com a própria conta — e o painel registra ' +
          'quem mexeu em cada pedido.'
        }
      />

      <Flexbox direction="column" gap={{ mobile: 8, desktop: 10 }}>
        <InviteForm onInvite={invite} />

        <TeamRoster
          title="No painel"
          hint="Quem recebe, aceita e acompanha os pedidos."
          entries={staffEntries}
          empty="Só você por enquanto. Chame alguém pelo convite acima."
          searchLabel="Buscar quem está no painel"
          isPending={isStaffPending}
          removingId={removing?.kind === 'STAFF' ? removing.id : undefined}
          onRemove={(id) => removeMember({ id, kind: 'STAFF' })}
          onEditEmail={setEditingStaffId}
          onChangeRole={
            canChangeRole
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
          searchLabel="Buscar quem está na rua"
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
