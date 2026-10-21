import { Box } from '@nino/ds/components/Box'
import { DatePicker } from '@nino/ds/components/DatePicker'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import { REPORTS_PERIODS } from '@pages/Reports/constants/reports.constants'
import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'
import type { PeriodChoice } from '@shared/types/ui/period-choice'

import motion from '@styles/motion.module.css'
import styles from './ReportsPeriodControls.module.css'

export const ReportsPeriodControls = () => {
  const { period, setPeriod, custom } = useReportsFacade()

  return (
    <Box direction="column" gap={4} className={styles.periodControls}>
      <Tabs
        className={`${motion.unroll} ${styles.periodTabs}`}
        fullWidth={{ mobile: true, tablet: false }}
        tabs={REPORTS_PERIODS.map(({ id, label }) => ({
          value: id,
          label,
          content: null,
        }))}
        value={period}
        onValueChange={(value) => setPeriod(value as PeriodChoice)}
      />
      {period === 'custom' && (
        <Box
          direction="row"
          gap={3}
          align="end"
          wrap
          mb={{ mobile: 5, desktop: 6 }}
          className={motion.unroll}
        >
          <Box as="label" direction="column" gap={1}>
            <Text className={styles.dateLabel}>De</Text>
            <DatePicker
              value={custom.fromDate}
              onValueChange={custom.setFrom}
              endMonth={custom.fromEndMonth}
            />
          </Box>
          <Box as="label" direction="column" gap={1}>
            <Text className={styles.dateLabel}>Até</Text>
            <DatePicker
              value={custom.toDate}
              onValueChange={custom.setTo}
              startMonth={custom.toStartMonth}
              endMonth={custom.toEndMonth}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
