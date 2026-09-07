import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { WEEK_SCHEDULE_DAYS } from '@pages/Units/constants/unit.constants'

import ghost from './WeekScheduleSkeleton.module.css'
import schedule from '@pages/Units/components/WeekSchedule/WeekSchedule.module.css'

/* WHY: o nome do dia e o "às" saem de constante, não do servidor — ficam
 * legíveis enquanto os horários carregam, em vez de virar barra cinza. */
export const WeekScheduleSkeleton = () => (
  <Box as="section" className={schedule.panel}>
    <Text as="p" role="status" className="sr-only">
      Carregando os horários
    </Text>

    <Box as="header" className={schedule.head}>
      <Skeleton className={ghost.heading} />
      <Skeleton className={ghost.lead} />
    </Box>

    <Box>
      <Box as="ul" className={schedule.week}>
        {WEEK_SCHEDULE_DAYS.map((day) => (
          <Box
            as="li"
            key={day}
            direction="row"
            align="center"
            wrap
            className={schedule.day}
          >
            <Skeleton className={ghost.switch} />

            <Text className={schedule.dayName}>{day}</Text>

            <Box direction="row" align="center" className={schedule.times}>
              <Skeleton
                className={mergeClasses(schedule.timeInput, ghost.timeInput)}
              />
              <Text className={schedule.until}>às</Text>
              <Skeleton
                className={mergeClasses(schedule.timeInput, ghost.timeInput)}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Skeleton className={mergeClasses(schedule.save, ghost.save)} />
    </Box>
  </Box>
)
