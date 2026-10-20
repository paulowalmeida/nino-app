import { EmptyState } from '@nino/ds/components/EmptyState'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { REPORTS_NOTICES } from '@pages/Reports/constants/reports.constants'
import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

import motion from '@styles/motion.module.css'

export const ReportsNotice = () => {
  const { status } = useReportsFacade()

  if (status === 'pending' || status === 'ready') return null

  const notice = REPORTS_NOTICES[status]

  return (
    <EmptyState
      className={motion.deal}
      title={'title' in notice ? notice.title : undefined}
      illustration={status === 'empty' ? <NinoMascot /> : undefined}
    >
      {notice.message}
    </EmptyState>
  )
}
