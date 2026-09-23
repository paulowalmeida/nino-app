import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { PauseDurationModal } from './PauseDurationModal/PauseDurationModal'

import motion from '@styles/motion.module.css'
import styles from './PauseSwitch.module.css'

export const PauseSwitch = () => {
  const { timezone, pause, pauseActions } = useOverviewFacade()
  const { data: pauseData, isPending } = pause
  const { pause: doPause, resume } = pauseActions

  const [openedAt, setOpenedAt] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const isOpen = openedAt !== null

  if (isPending) {
    return <Skeleton className={styles.skeleton} />
  }

  if (!pauseData) return null

  const clock = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone ?? undefined,
  })

  const until = pauseData.pausedUntil
    ? clock.format(new Date(pauseData.pausedUntil))
    : null

  if (pauseData.isPaused) {
    return (
      <Box
        as="section"
        id="controle-da-loja"
        wrap
        align="center"
        justify="between"
        gap={3}
        className={`${motion.settle} ${styles.paused}`}
      >
        <Box className={styles.pausedSummary}>
          <Text as="p" className={styles.title}>
            {until ? `Fechada até ${until}` : 'Fechada até você reabrir'}
          </Text>
          <Text as="p" className={styles.hint}>
            {pauseData.pauseReason ||
              'O cliente vê a loja fechada e não consegue pedir.'}
          </Text>
        </Box>
        <Button
          size="sm"
          loading={resume.isPending}
          className={motion.press}
          onClick={() => resume.mutate()}
        >
          Reabrir agora
        </Button>
      </Box>
    )
  }

  const closeModal = () => {
    setOpenedAt(null)
    setReason('')
  }

  const handleSelectDuration = (minutes: number | undefined) => {
    doPause.mutate({ minutes, reason: reason || undefined })
    closeModal()
  }

  return (
    <Box as="section" id="controle-da-loja">
      <Button
        variant="warning"
        className={`${motion.press} ${styles.trigger} w-3xs`}
        onClick={() => setOpenedAt(Date.now())}
      >
        <Icon name="pause" size="sm" />
        Fechar a loja por um tempo
      </Button>

      <PauseDurationModal
        open={isOpen}
        onOpenChange={(open) => (open ? setOpenedAt(Date.now()) : closeModal())}
        openedAt={openedAt}
        timezone={timezone}
        reason={reason}
        onReasonChange={setReason}
        onSelectDuration={handleSelectDuration}
        onCancel={closeModal}
        isPending={doPause.isPending}
        pendingMinutes={doPause.variables?.minutes}
      />
    </Box>
  )
}
