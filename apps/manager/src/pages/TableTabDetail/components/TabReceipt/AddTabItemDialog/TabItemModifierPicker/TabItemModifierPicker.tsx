import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Label } from '@nino/ds/components/Label'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import type { TabModifierSelection } from '@pages/TableTabDetail/types/TabModifierSelection.type'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import type { MenuItemModifierOption } from '@shared/types/product/menu-item-modifier-option'
import { brl } from '@shared/utils/money/money'

import styles from './TabItemModifierPicker.module.css'

type TabItemModifierPickerProps = {
  modifiers: MenuItemModifier[]
  selection: TabModifierSelection
  onToggle: (
    modifier: MenuItemModifier,
    optionId: string,
    isChecked: boolean
  ) => void
}

const priceLabel = ({ price }: MenuItemModifierOption): string | undefined =>
  Number(price) > 0 ? `+ ${brl(price)}` : undefined

export const TabItemModifierPicker = ({
  modifiers,
  selection,
  onToggle,
}: TabItemModifierPickerProps) => (
  <Box className={styles.tabItemModifierPicker}>
    {modifiers.map((modifier) => {
      const chosenOptionIds = selection[modifier.id] ?? []
      const isAtLimit = chosenOptionIds.length >= modifier.maxSelections

      return (
        <Box
          key={modifier.id}
          as="fieldset"
          className={styles.tabItemModifierPickerGroup}
        >
          <Box direction="row" className={styles.tabItemModifierPickerHeader}>
            <Box className={styles.tabItemModifierPickerIdentity}>
              <Text as="span" weight="bold">
                {modifier.name}
              </Text>
              <Text size="sm" color="muted">
                {modifier.minSelections > 0
                  ? `Escolha ao menos ${modifier.minSelections}`
                  : 'Opcional'}
                {modifier.maxSelections > 1
                  ? `, até ${modifier.maxSelections}`
                  : ''}
              </Text>
            </Box>
            {modifier.minSelections > 0 &&
            chosenOptionIds.length < modifier.minSelections ? (
              <Badge variant="default" size="sm">
                Obrigatório
              </Badge>
            ) : (
              <Text size="sm" color="muted" className={styles.tally}>
                {chosenOptionIds.length}/{modifier.maxSelections}
              </Text>
            )}
          </Box>
          {modifier.maxSelections === 1 ? (
            <RadioGroup
              className={styles.donenessOptions}
              aria-label={modifier.name}
              value={chosenOptionIds[0] ?? ''}
              options={modifier.options.map((option) => ({
                value: option.id,
                label: option.name,
                trailing: priceLabel(option),
              }))}
              onValueChange={(optionId) => onToggle(modifier, optionId, true)}
            />
          ) : (
            modifier.options.map((option) => {
              const isChecked = chosenOptionIds.includes(option.id)

              return (
                <Label
                  key={option.id}
                  className={styles.tabItemModifierPickerOption}
                >
                  <Text as="span">{option.name}</Text>
                  <Box
                    direction="row"
                    align="center"
                    gap={3}
                    className={styles.tabItemModifierPickerTrailing}
                  >
                    <Text
                      as="span"
                      size="sm"
                      color="muted"
                      className={styles.tabItemModifierPickerPrice}
                    >
                      {priceLabel(option)}
                    </Text>
                    <Checkbox
                      checked={isChecked}
                      disabled={!isChecked && isAtLimit}
                      onCheckedChange={(checked) =>
                        onToggle(modifier, option.id, !!checked)
                      }
                    />
                  </Box>
                </Label>
              )
            })
          )}
        </Box>
      )
    })}
  </Box>
)
