import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { ColorPicker } from '@nino/ds/components/ColorPicker'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'

import styles from './ColorField.module.css'

export type ColorFieldProps = {
  label: string
  hint: string
  value: string
  onValueChange: (value: string) => void
}

export const ColorField = ({
  label,
  hint,
  value,
  onValueChange,
}: ColorFieldProps) => {
  const [isOpen, setOpen] = useState(false)
  const [pickedColor, setPickedColor] = useState(value)

  return (
    <>
      <Card
        variant="flat"
        padding="sm"
        className={styles.tile}
        aria-haspopup="dialog"
        aria-label={`${label}: ${value.toUpperCase()}. Escolher outra cor`}
        onClick={() => {
          setPickedColor(value)
          setOpen(true)
        }}
      >
        <Box
          direction="row"
          gap={3}
          align="center"
          className={styles.colorFieldRow}
        >
          <Box
            aria-hidden="true"
            className={styles.swatch}
            style={{ backgroundColor: value }}
          />
          <Box className={styles.colorFieldMeta}>
            <Text
              size="sm"
              weight="semibold"
              className={styles.colorFieldLabel}
            >
              {label}
            </Text>
            <Text size="xs" color="faint" className={styles.hint}>
              {hint}
            </Text>
            <Text size="xs" className={styles.hex}>
              {value.toUpperCase()}
            </Text>
          </Box>
        </Box>
      </Card>

      <Modal
        open={isOpen}
        onOpenChange={setOpen}
        header={
          <Heading level={2} size="lg">
            {label}
          </Heading>
        }
        body={
          <ColorPicker value={pickedColor} onValueChange={setPickedColor} />
        }
        footer={
          <Box direction="row" gap={2}>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onValueChange(pickedColor)
                setOpen(false)
              }}
            >
              Aplicar
            </Button>
          </Box>
        }
      />
    </>
  )
}
