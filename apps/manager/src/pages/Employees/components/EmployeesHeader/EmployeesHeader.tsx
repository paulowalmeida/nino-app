import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'

import { InviteModal } from './InviteModal/InviteModal'

import motion from '@styles/motion.module.css'
import styles from './EmployeesHeader.module.css'

const INVITE_ACTION = 'convidar'

export const EmployeesHeader = () => {
  const { invite, inviteSeats } = useEmployeesFacade()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isInviteOpen, setInviteOpen] = useState(
    () => searchParams.get('acao') === INVITE_ACTION
  )

  const changeInviteOpen = (open: boolean) => {
    setInviteOpen(open)
    if (open || !searchParams.has('acao')) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('acao')
    setSearchParams(nextParams, { replace: true })
  }

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
