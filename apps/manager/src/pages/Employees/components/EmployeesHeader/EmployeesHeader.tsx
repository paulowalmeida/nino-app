import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'
import { useRouteAction } from '@shared/hooks/ui/useRouteAction/useRouteAction'

import { InviteModal } from './InviteModal/InviteModal'

import motion from '@styles/motion.module.css'
import styles from './EmployeesHeader.module.css'

const INVITE_ACTION = 'convidar'

export const EmployeesHeader = () => {
  const { invite, inviteSeats } = useEmployeesFacade()
  const [isInviteOpen, setInviteOpen] = useState(false)
  useRouteAction(INVITE_ACTION, () => setInviteOpen(true))

  const changeInviteOpen = (open: boolean) => setInviteOpen(open)

  return (
    <>
      <Header
        mb={{ mobile: 6, desktop: 8 }}
        className={`${motion.deal} ${styles.employeesHeader}`}
        title="Colaboradores"
        accent="colaboradores"
        description={
          'Cada pessoa entra com a própria conta — e o painel registra ' +
          'quem mexeu em cada pedido.'
        }
        actions={
          <Button
            className={motion.press}
            onClick={() => changeInviteOpen(true)}
          >
            <Icon name="plus" size="sm" />
            Convidar
          </Button>
        }
      />

      <InviteModal
        open={isInviteOpen}
        onOpenChange={changeInviteOpen}
        seats={inviteSeats}
        onInvite={invite}
      />
    </>
  )
}
