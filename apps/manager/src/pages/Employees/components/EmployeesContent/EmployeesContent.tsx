import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Tabs } from '@nino/ds/components/Tabs'
import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'
import { EditEmailModal } from '@shared/components/EditEmailModal/EditEmailModal'
import type { RosterEntry } from '@shared/types/team/roster-entry'

import { InviteForm } from './InviteForm/InviteForm'
import { TeamRoster } from './TeamRoster/TeamRoster'

export const EmployeesContent = () => {
  const facade = useEmployeesFacade()
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const editingStaff = facade.staffEntries.find(
    ({ id }: RosterEntry) => id === editingStaffId
  )
  const removing = facade.isRemoving ? facade.removingVariables : undefined
  const canChangeRole = facade.tenant?.role === 'TENANT_OWNER'

  return (
    <>
      <Box direction="column" gap={{ mobile: 8, desktop: 10 }}>
        <InviteForm onInvite={facade.invite} />

        <Tabs
          tabs={[
            {
              value: 'staff',
              label: `No painel · ${facade.staffEntries.length}`,
              content: (
                <TeamRoster
                  title="No painel"
                  hint="Quem recebe, aceita e acompanha os pedidos."
                  entries={facade.staffEntries}
                  empty="Só você por enquanto. Chame alguém pelo convite acima."
                  searchLabel="Buscar quem está no painel"
                  isPending={facade.isStaffPending}
                  removingId={
                    removing?.kind === 'STAFF' ? removing.id : undefined
                  }
                  onRemove={(id) => facade.removeMember({ id, kind: 'STAFF' })}
                  onEditEmail={setEditingStaffId}
                  onChangeRole={
                    canChangeRole
                      ? (userId, role) => facade.changeRole({ userId, role })
                      : undefined
                  }
                  changingRoleId={
                    facade.isChangingRole
                      ? facade.roleVariables?.userId
                      : undefined
                  }
                />
              ),
            },
            {
              value: 'couriers',
              label: `Na rua · ${facade.courierEntries.length}`,
              content: (
                <TeamRoster
                  title="Na rua"
                  hint="Quem leva o pedido até a porta do cliente."
                  entries={facade.courierEntries}
                  empty="Nenhum entregador cadastrado nesta loja."
                  searchLabel="Buscar quem está na rua"
                  isPending={facade.isCourierPending}
                  removingId={
                    removing?.kind === 'COURIER' ? removing.id : undefined
                  }
                  onRemove={(id) =>
                    facade.removeMember({ id, kind: 'COURIER' })
                  }
                />
              ),
            },
          ]}
        />
      </Box>

      <EditEmailModal
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaffId(null)}
        title="Editar e-mail"
        hint={`Usado por ${editingStaff?.name ?? ''} para entrar no painel.`}
        currentEmail={editingStaff?.email ?? null}
        onSave={(email) =>
          facade.updateStaffEmail({ userId: editingStaff?.id ?? '', email })
        }
      />
    </>
  )
}
