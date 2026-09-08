import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { ListRow } from '@nino/ds/components/ListRow'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { TimePicker } from '@nino/ds/components/TimePicker'
import { WEEK_SCHEDULE_DAYS } from '@pages/Units/constants/unit.constants'
import { WeekScheduleSkeleton } from '@pages/Units/skeletons/WeekScheduleSkeleton/WeekScheduleSkeleton'
import type { HoursDraft } from '@shared/types/settings/hours-draft'
import type { OpeningHours } from '@shared/types/settings/opening-hours'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import local from './WeekSchedule.module.css'

export type WeekScheduleProps = {
  hours: OpeningHours[]
  isPending: boolean
  isSaving: boolean
  onSave: (week: HoursDraft[]) => Promise<unknown>
}

const blank = (dayOfWeek: number): HoursDraft => ({
  dayOfWeek,
  openTime: '18:00',
  closeTime: '23:00',
  isOpen: false,
})

const toWeek = (hours: OpeningHours[]): HoursDraft[] =>
  WEEK_SCHEDULE_DAYS.map((_, day) => {
    const saved = hours.find(({ dayOfWeek }) => dayOfWeek === day)
    if (!saved) return blank(day)
    return {
      id: saved.id,
      dayOfWeek: day,
      openTime: saved.openTime,
      closeTime: saved.closeTime,
      isOpen: saved.isOpen,
    }
  })

export const WeekSchedule = ({
  hours,
  isPending,
  isSaving,
  onSave,
}: WeekScheduleProps) => {
  const [week, setWeek] = useState<HoursDraft[]>(() =>
    WEEK_SCHEDULE_DAYS.map((_, day) => blank(day))
  )
  const [saved, setSaved] = useState<HoursDraft[]>(() =>
    WEEK_SCHEDULE_DAYS.map((_, day) => blank(day))
  )
  const [seed, setSeed] = useState<OpeningHours[] | null>(null)

  if (hours !== seed) {
    setSeed(hours)
    setWeek(toWeek(hours))
    setSaved(toWeek(hours))
  }

  const changed = week.filter((day, index) => {
    const before = saved[index]
    return (
      day.isOpen !== before.isOpen ||
      day.openTime !== before.openTime ||
      day.closeTime !== before.closeTime
    )
  })

  const change = (day: number, patch: Partial<HoursDraft>) => {
    setWeek((current) =>
      current.map((entry) =>
        entry.dayOfWeek === day ? { ...entry, ...patch } : entry
      )
    )
  }

  const handleSave = async () => {
    const sent = week
    await onSave(changed)
    setSaved(sent)
  }

  if (isPending) return <WeekScheduleSkeleton />

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">
          Quando a loja abre
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Fora do horário, o cliente vê a loja fechada e não consegue pedir.
        </Text>
      </Box>

      <Box className={local.body}>
        <Box as="ul" className={local.week}>
          {week.map((entry, index) => (
            <ListRow
              key={entry.dayOfWeek}
              divider="none"
              gap={3}
              padding={2}
              wrap
              className={`${motion.deal} ${local.day} ${
                entry.isOpen ? '' : local.closed
              }`}
              style={riseDelay(index * 45 + 60)}
            >
              <Switch
                checked={entry.isOpen}
                onCheckedChange={(checked) =>
                  change(entry.dayOfWeek, { isOpen: checked })
                }
                aria-label={WEEK_SCHEDULE_DAYS[entry.dayOfWeek]}
              />

              <Text className={local.dayName}>
                {WEEK_SCHEDULE_DAYS[entry.dayOfWeek]}
              </Text>

              <Box className={local.times}>
                <TimePicker
                  size="sm"
                  className={local.timeInput}
                  ariaLabel={`Abre ${WEEK_SCHEDULE_DAYS[entry.dayOfWeek]}`}
                  disabled={!entry.isOpen}
                  value={entry.openTime}
                  onValueChange={(openTime) =>
                    change(entry.dayOfWeek, { openTime })
                  }
                />
                <Text className={local.until}>às</Text>
                <TimePicker
                  size="sm"
                  className={local.timeInput}
                  ariaLabel={`Fecha ${WEEK_SCHEDULE_DAYS[entry.dayOfWeek]}`}
                  disabled={!entry.isOpen}
                  value={entry.closeTime}
                  onValueChange={(closeTime) =>
                    change(entry.dayOfWeek, { closeTime })
                  }
                />
              </Box>
            </ListRow>
          ))}
        </Box>

        <Button
          loading={isSaving}
          disabled={changed.length === 0}
          className={`${motion.press} ${local.save}`}
          onClick={() => void handleSave()}
        >
          Salvar horários
        </Button>
      </Box>
    </Box>
  )
}
