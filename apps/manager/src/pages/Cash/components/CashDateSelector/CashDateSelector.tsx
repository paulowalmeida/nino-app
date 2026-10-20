import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { DatePicker } from '@nino/ds/components/DatePicker'
import { Text } from '@nino/ds/components/Text'
import { useCashFacade } from '@pages/Cash/facades/useCashFacade/useCashFacade'

export const CashDateSelector = () => {
  const { date, isToday, setDate } = useCashFacade()

  return (
    <Box as="section" direction="row" align="end" gap={3} wrap>
      <Box as="label" direction="column" gap={1}>
        <Text size="sm" color="muted">
          Dia do caixa
        </Text>
        <DatePicker
          value={date}
          onValueChange={setDate}
          endMonth={new Date()}
        />
      </Box>

      {!isToday && (
        <Button variant="outline" onClick={() => setDate(undefined)}>
          Voltar para hoje
        </Button>
      )}
    </Box>
  )
}
