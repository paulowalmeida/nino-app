import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { HoverCard } from '@nino/ds/components/HoverCard'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

export type FieldHintProps = {
  label: string
  hint: string
}

export const FieldHint = ({ label, hint }: FieldHintProps) => (
  <Box direction="row" align="center" gap={1}>
    <Text as="span" size="sm" weight="medium">
      {label}
    </Text>
    <HoverCard
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="-my-3 h-11 w-11"
          aria-label={`Mais informações sobre ${label}`}
        >
          <Icon name="info" size="sm" />
        </Button>
      }
    >
      <Text size="sm">{hint}</Text>
    </HoverCard>
  </Box>
)
