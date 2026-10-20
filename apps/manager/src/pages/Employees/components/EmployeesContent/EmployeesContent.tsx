import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Tabs } from '@nino/ds/components/Tabs'
import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'
import type { RosterEntry } from '@shared/types/team/roster-entry'

import { EditStaffModal } from './EditStaffModal/EditStaffModal'
import { InviteForm } from './InviteForm/InviteForm'
import { TeamRoster } from './TeamRoster/TeamRoster'

export const EmployeesContent = () => {
  const facade = useEmployeesFacade()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const editingStaff = [
    ...facade.staffEntries,
    ...facade.inactiveStaffEntries,
  ].find(({ id }: RosterEntry) => id === editingStaffId)
  const removing = facade.isRemoving ? facade.removingVariables : undefined
  const canChangePosition = facade.unit?.role === 'UNIT_OWNER'
  const requestedTab = searchParams.get('tab')
  const activeTab =
    requestedTab === 'inactive' || requestedTab === 'couriers'
      ? requestedTab
      : 'active'

  const changeTab = (value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'active') nextParams.delete('tab')
    else nextParams.set('tab', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <Box direction="column" gap={{ mobile: 8, desktop: 10 }}>
        <InviteForm onInvite={facade.invite} seats={facade.inviteSeats} />

        <Tabs
          value={activeTab}
          onValueChange={changeTab}
          tabs={[
            {
              value: 'active',
              label: `Ativos · ${facade.staffEntries.length}`,
              content: (
                <TeamRoster
                  title="Ativos"
                  hint="Quem recebe, aceita e acompanha os pedidos."
                  entries={facade.staffEntries}
                  empty="Só você por enquanto. Chame alguém pelo convite acima."
                  searchLabel="Buscar quem está no painel"
                  isPending={facade.isStaffPending}
                  removingId={
                    removing?.kind === 'STAFF' ? removing.id : undefined
                  }
                  onRemove={(id) => facade.removeMember({ id, kind: 'STAFF' })}
                  onEdit={setEditingStaffId}
                  onSetActivity={(id) =>
                    facade.setStaffActivity({ userId: id, isActive: false })
                  }
                  changingActivityId={
                    facade.isChangingActivity
                      ? facade.activityVariables?.userId
                      : undefined
                  }
                  onChangePosition={
                    canChangePosition
                      ? (userId, positionId) =>
                          facade.changePosition({ userId, positionId })
                      : undefined
                  }
                  changingPositionId={
                    facade.isChangingPosition
                      ? facade.positionVariables?.userId
                      : undefined
                  }
                />
              ),
            },
            {
              value: 'inactive',
              label: `Inativos · ${facade.inactiveStaffEntries.length}`,
              content: (
                <TeamRoster
                  title="Inativos"
                  hint="Quem foi suspenso permanece no histórico da loja."
                  entries={facade.inactiveStaffEntries}
                  empty="Nenhum colaborador suspenso nesta loja."
                  searchLabel="Buscar quem está inativo"
                  isPending={facade.isInactiveStaffPending}
                  removingId={
                    removing?.kind === 'STAFF' ? removing.id : undefined
                  }
                  onRemove={(id) => facade.removeMember({ id, kind: 'STAFF' })}
                  onEdit={setEditingStaffId}
                  onSetActivity={(id) =>
                    facade.setStaffActivity({ userId: id, isActive: true })
                  }
                  changingActivityId={
                    facade.isChangingActivity
                      ? facade.activityVariables?.userId
                      : undefined
                  }
                  isInactive
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

      <EditStaffModal
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaffId(null)}
        staff={editingStaff ?? null}
        onSave={({ name, email }) =>
          facade.updateStaffProfile({
            userId: editingStaff?.id ?? '',
            name,
            email,
          })
        }
      />
    </>
  )
}
