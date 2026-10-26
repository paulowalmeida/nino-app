import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { Tabs } from '@nino/ds/components/Tabs'
import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'
import type { RosterEntry } from '@shared/types/team/roster-entry'

import { EditStaffModal } from './EditStaffModal/EditStaffModal'
import { TeamRoster } from './TeamRoster/TeamRoster'

import styles from './EmployeesContent.module.css'

export const EmployeesContent = () => {
  const facade = useEmployeesFacade()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const editingStaff = [
    ...facade.activeEntries,
    ...facade.inactiveEntries,
  ].find(({ id }: RosterEntry) => id === editingStaffId)
  const removing = facade.isRemoving ? facade.removingVariables : undefined
  const canChangePosition = facade.unit?.role === 'UNIT_OWNER'
  const requestedTab = searchParams.get('tab')
  const activeTab = requestedTab === 'inactive' ? 'inactive' : 'active'

  const changeTab = (value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'active') nextParams.delete('tab')
    else nextParams.set('tab', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <Box direction="column" className={styles.employeesContent}>
        <Box className={styles.employeesToolbar}>
          <Input
            type="search"
            value={term}
            placeholder="Nome ou e-mail"
            aria-label="Buscar colaborador por nome ou e-mail"
            className={styles.employeesSearch}
            onChange={(event) => setTerm(event.target.value)}
          />
          <Tabs
            label="Situação dos colaboradores"
            className={styles.employeesTabs}
            fullWidth={{ mobile: true, tablet: false }}
            value={activeTab}
            onValueChange={changeTab}
            tabs={[
              {
                value: 'active',
                label: `Ativos · ${facade.activeEntries.length}`,
                content: null,
              },
              {
                value: 'inactive',
                label: `Inativos · ${facade.inactiveEntries.length}`,
                content: null,
              },
            ]}
          />
        </Box>

        {activeTab === 'active' ? (
          <TeamRoster
            title="Ativos"
            term={term}
            entries={facade.activeEntries}
            empty="Só você por enquanto. Chame alguém pelo convite acima."
            isPending={facade.isActivePending}
            removingId={removing?.id}
            onRemove={(id, kind) => facade.removeMember({ id, kind })}
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
        ) : (
          <TeamRoster
            title="Inativos"
            term={term}
            entries={facade.inactiveEntries}
            empty="Nenhum colaborador suspenso nesta loja."
            isPending={facade.isInactivePending}
            removingId={removing?.id}
            onRemove={(id, kind) => facade.removeMember({ id, kind })}
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
        )}
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
