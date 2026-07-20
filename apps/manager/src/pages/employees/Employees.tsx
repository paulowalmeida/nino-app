import { PageTitle } from '@components/PageTitle'
import { InviteForm } from '@compositions/InviteForm'
import { TeamRoster } from '@compositions/TeamRoster'
import type { RosterEntry } from '@compositions/TeamRoster/TeamRoster.types'
import { useCouriers } from '@hooks/team/useCouriers'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useInvite } from '@hooks/team/useInvite'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useStaff } from '@hooks/team/useStaff'
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
  const { mutate: removeMember, variables: removing } =
    useRemoveMember(tenantId)

  const staffEntries: RosterEntry[] = (staff?.data ?? []).map(
    ({ user, role }) => ({
      id: user.id,
      name: user.name,
      email: emailOf(user),
      role: ROLE_LABEL[role],
      removable: role !== 'TENANT_OWNER',
    })
  )

  const courierEntries: RosterEntry[] = (couriers?.data ?? []).map(
    ({ courier, isActive }) => ({
      id: courier.id,
      name: courier.name,
      email: emailOf(courier),
      role: isActive ? 'Ativo' : 'Parado',
      quiet: true,
      removable: true,
    })
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <PageTitle accent="equipe">Quem toca a equipe</PageTitle>
        <p className={styles.subtitle}>
          Cada pessoa entra com a própria conta — e o painel registra quem
          mexeu em cada pedido.
        </p>
      </header>

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
    </div>
  )
}
