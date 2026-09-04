import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Text } from '@nino/ds/components/Text'

import styles from './StudioSection.module.css'

export type StudioSectionProps = {
  title: string
  description: string
  children: ReactNode
}

export const StudioSection = ({
  title,
  description,
  children,
}: StudioSectionProps) => (
  <Box as="section" aria-label={title} className={styles.section}>
    <Collapsible defaultOpen indicator trigger={title}>
      <Box className={styles.body}>
        <Text size="sm" color="subtle">
          {description}
        </Text>
        {children}
      </Box>
    </Collapsible>
  </Box>
)
