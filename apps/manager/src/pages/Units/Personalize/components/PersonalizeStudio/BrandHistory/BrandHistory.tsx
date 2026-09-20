import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { toPublishedAtLabel } from '@pages/Units/utils/toPublishedAtLabel/toPublishedAtLabel'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandHistory.module.css'

const SECTION_DESCRIPTION =
  'Cada publicação vira uma versão. Dá pra voltar para uma delas.'

const RESTORE_DESCRIPTION =
  'Essa versão volta para o ar agora, no lugar da atual. ' +
  'A atual continua no histórico.'

export const BrandHistory = () => {
  const { theme } = useUnitsFacade()
  const { mutate: restore, isPending: isRestoring } = theme.restore
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null)

  const published = theme.editor.data?.published ?? null
  const history = theme.editor.data?.history ?? []

  return (
    <StudioSection title="Versões" description={SECTION_DESCRIPTION}>
      {published ? (
        <Box as="ul" className={styles.versions}>
          <ListRow divider="none">
            <Box
              direction="row"
              align="center"
              justify="between"
              gap={2}
              wrap
              className={styles.row}
            >
              <Text size="sm" weight="semibold">
                {`Versão ${published.version} · no ar`}
              </Text>
              <Text size="sm" color="subtle">
                {toPublishedAtLabel(published.publishedAt)}
              </Text>
            </Box>
          </ListRow>

          {history.map((version) => (
            <ListRow key={version.id}>
              <Box
                direction="row"
                align="center"
                justify="between"
                gap={2}
                wrap
                className={styles.row}
              >
                <Text size="sm">{`Versão ${version.version}`}</Text>
                <Box direction="row" align="center" gap={2}>
                  <Text size="sm" color="subtle">
                    {toPublishedAtLabel(version.publishedAt)}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isRestoring}
                    onClick={() => setVersionToRestore(version.version)}
                  >
                    Restaurar
                  </Button>
                </Box>
              </Box>
            </ListRow>
          ))}
        </Box>
      ) : (
        <Text size="sm" color="subtle">
          As versões aparecem aqui depois da primeira publicação.
        </Text>
      )}

      <Dialog
        open={versionToRestore !== null}
        title={`Restaurar a versão ${versionToRestore ?? ''}?`}
        description={RESTORE_DESCRIPTION}
        confirmLabel="Restaurar"
        loading={isRestoring}
        onConfirm={() => {
          if (versionToRestore !== null) restore(versionToRestore)
          setVersionToRestore(null)
        }}
        onCancel={() => setVersionToRestore(null)}
        onOpenChange={(open) => !open && setVersionToRestore(null)}
      />
    </StudioSection>
  )
}
