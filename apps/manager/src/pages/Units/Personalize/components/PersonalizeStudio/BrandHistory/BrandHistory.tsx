import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { FormField } from '@nino/ds/components/FormField'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'
import { toPublishedAtLabel } from '@pages/Units/utils/toPublishedAtLabel/toPublishedAtLabel'

import { StudioSection } from '../StudioSection/StudioSection'

import styles from './BrandHistory.module.css'

const SECTION_DESCRIPTION =
  'Cada publicação vira uma versão. Dá pra voltar para uma delas.'

const RESTORE_DESCRIPTION =
  'Essa versão volta para o ar agora, no lugar da atual. ' +
  'A atual continua no histórico.'

const MAX_HISTORY_VERSIONS = 10

export type BrandHistoryProps = {
  onLoadVersion?: (version: UnitTheme) => void
}

export const BrandHistory = ({ onLoadVersion }: BrandHistoryProps) => {
  const { theme } = useUnitsFacade()
  const { mutate: restore, isPending: isRestoring } = theme.restore
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null)

  const published = theme.editor.data?.published ?? null
  const history = theme.editor.data?.history ?? []
  const draft = theme.editor.data?.draft ?? null
  const versions = [
    ...(draft
      ? [
          {
            value: draft.id,
            label: `Rascunho · versão ${draft.version}`,
            theme: draft,
          },
        ]
      : []),
    ...(published
      ? [
          {
            value: published.id,
            label: `Versão ${published.version} · no ar`,
            theme: published,
          },
        ]
      : []),
    ...history.slice(0, MAX_HISTORY_VERSIONS).map((version) => ({
      value: version.id,
      label: `Versão ${version.version}`,
      theme: version,
    })),
  ]
  const [selectedVersionId, setSelectedVersionId] = useState(
    versions[0]?.value ?? ''
  )

  useEffect(() => {
    setSelectedVersionId((current) =>
      versions.some((version) => version.value === current)
        ? current
        : (versions[0]?.value ?? '')
    )
  }, [versions])

  const selectedVersion =
    versions.find((version) => version.value === selectedVersionId) ?? null
  const canRestoreSelected = Boolean(
    selectedVersion &&
    history.some((version) => version.id === selectedVersion.theme.id)
  )

  return (
    <StudioSection title="Versões" description={SECTION_DESCRIPTION}>
      {versions.length > 0 ? (
        <>
          <FormField
            label="Configuração para editar"
            helperText="Carregue uma versão salva para continuar editando a partir dela."
          >
            <Select
              options={versions.map(({ value, label }) => ({ value, label }))}
              value={selectedVersionId}
              onValueChange={(value) => {
                setSelectedVersionId(value)
                const version = versions.find(
                  (candidate) => candidate.value === value
                )
                if (version) onLoadVersion?.(version.theme)
              }}
            />
          </FormField>

          {selectedVersion && (
            <Box
              direction="row"
              align="center"
              justify="between"
              gap={2}
              wrap
              className={styles.brandHistoryRow}
            >
              <Text size="sm" color="subtle">
                {selectedVersion.theme.publishedAt
                  ? toPublishedAtLabel(selectedVersion.theme.publishedAt)
                  : 'Ainda não publicada'}
              </Text>
              {canRestoreSelected && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isRestoring}
                  onClick={() =>
                    setVersionToRestore(selectedVersion.theme.version)
                  }
                >
                  Restaurar
                </Button>
              )}
            </Box>
          )}
        </>
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
