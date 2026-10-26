import { backofficeService } from '@app/services/backoffice.service'
import {
  SubscriptionInterest,
  SubscriptionInterestStatus,
} from '@app/services/types'
import styles from '@app/styles/app.module.css'
import { Alert } from '@nino/ds/components/Alert'
import { Badge, type BadgeVariant } from '@nino/ds/components/Badge'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { ApiError } from '@nino/lib/utils/api-error'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type InterestFilter = SubscriptionInterestStatus | 'ALL'

const statusMeta: Record<
  SubscriptionInterestStatus,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  IN_CONTACT: { label: 'Em contato', variant: 'info' },
  CONVERTED: { label: 'Convertida', variant: 'success' },
  CLOSED: { label: 'Encerrada', variant: 'default' },
}

const filterOptions = [
  { value: 'ALL', label: 'Todas as solicitações' },
  ...Object.entries(statusMeta).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
]

const statusOptions = Object.entries(statusMeta).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

const formatContactMethod = (method: SubscriptionInterest['preferredContactMethod']) => {
  if (method === 'WHATSAPP') return 'WhatsApp'
  if (method === 'PHONE') return 'Telefone'
  return 'E-mail'
}

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError || error instanceof Error ? error.message : fallback

export function SubscriptionInterestsPage() {
  const [filter, setFilter] = useState<InterestFilter>('ALL')
  const [interests, setInterests] = useState<SubscriptionInterest[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<SubscriptionInterest | null>(null)
  const [queueError, setQueueError] = useState<string | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [isQueueLoading, setIsQueueLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [status, setStatus] = useState<SubscriptionInterestStatus>('PENDING')
  const [notes, setNotes] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const detailRequest = useRef(0)

  const applyQueue = useCallback((queue: SubscriptionInterest[]) => {
    setInterests(queue)
    setSelectedId((currentSelectedId) =>
      currentSelectedId && queue.some(({ id }) => id === currentSelectedId)
        ? currentSelectedId
        : null,
    )
    setSelected((currentSelected) =>
      currentSelected && queue.some(({ id }) => id === currentSelected.id)
        ? currentSelected
        : null,
    )
  }, [])

  const fetchQueue = useCallback(async (currentFilter: InterestFilter) => {
    try {
      const response = await backofficeService.listSubscriptionInterests(
        currentFilter === 'ALL' ? undefined : currentFilter,
      )
      applyQueue(response.data)
    } catch (error) {
      setQueueError(errorMessage(error, 'Não foi possível carregar as solicitações.'))
    } finally {
      setIsQueueLoading(false)
    }
  }, [applyQueue])

  const reloadQueue = useCallback(
    (currentFilter: InterestFilter) => {
      setIsQueueLoading(true)
      setQueueError(null)
      return fetchQueue(currentFilter)
    },
    [fetchQueue],
  )

  useEffect(() => {
    let isCurrent = true
    backofficeService
      .listSubscriptionInterests()
      .then((response) => isCurrent && applyQueue(response.data))
      .catch(
        (error) =>
          isCurrent &&
          setQueueError(
            errorMessage(error, 'Não foi possível carregar as solicitações.'),
          ),
      )
      .finally(() => isCurrent && setIsQueueLoading(false))
    return () => {
      isCurrent = false
    }
  }, [applyQueue])

  const closeInterest = () => {
    detailRequest.current += 1
    setSelectedId(null)
    setSelected(null)
    setDetailError(null)
    setIsDetailLoading(false)
  }

  const openInterest = async (id: string) => {
    detailRequest.current += 1
    const requestId = detailRequest.current
    const selectedFromQueue = interests.find((interest) => interest.id === id)
    setSelectedId(id)
    if (selectedFromQueue) {
      setSelected(selectedFromQueue)
      setStatus(selectedFromQueue.status)
      setNotes(selectedFromQueue.backofficeNotes ?? '')
    }
    setIsDetailLoading(true)
    setDetailError(null)
    try {
      const interest = await backofficeService.getSubscriptionInterest(id)
      if (requestId !== detailRequest.current) return
      setSelected(interest)
      setStatus(interest.status)
      setNotes(interest.backofficeNotes ?? '')
    } catch (error) {
      if (requestId === detailRequest.current) {
        setDetailError(errorMessage(error, 'Não foi possível abrir esta solicitação.'))
      }
    } finally {
      if (requestId === detailRequest.current) setIsDetailLoading(false)
    }
  }

  const visibleCount = useMemo(() => interests.length, [interests.length])

  const handleSave = async () => {
    if (!selected) return
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const updated = await backofficeService.updateSubscriptionInterestStatus(
        selected.id,
        { status, backofficeNotes: notes },
      )
      setSelected(updated)
      setInterests((current) =>
        current.map((interest) => (interest.id === updated.id ? updated : interest)),
      )
      setSaveSuccess(true)
    } catch (error) {
      setSaveError(errorMessage(error, 'Não foi possível salvar o status.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className={styles.page} aria-labelledby="interests-title">
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.pageEyebrow}>Comercial · Rede</div>
          <Heading id="interests-title" level={1}>
            Solicitações Rede
          </Heading>
          <Text color="muted" className={styles.pageIntro}>
            Entenda a operação de cada restaurante antes de iniciar a conversa.
          </Text>
        </div>
        <div className={styles.queueSummary} aria-live="polite">
          <strong>{visibleCount}</strong>
          <span>{visibleCount === 1 ? 'solicitação visível' : 'solicitações visíveis'}</span>
        </div>
      </header>

      <div className={styles.filterBar}>
        <FormField label="Filtrar por status" labelVariant="compact">
          <Select
            options={filterOptions}
            value={filter}
            onValueChange={(value) => {
              const nextFilter = value as InterestFilter
              setFilter(nextFilter)
              void reloadQueue(nextFilter)
            }}
          />
        </FormField>
        <Text size="sm" color="muted" className={styles.filterHint}>
          Comece pelas pendentes e registre cada próximo passo.
        </Text>
      </div>

      {queueError && (
        <Alert variant="error" title="Fila indisponível">
          <span>{queueError}</span>{' '}
          <button className={styles.inlineAction} onClick={() => void reloadQueue(filter)} type="button">
            Tentar novamente
          </button>
        </Alert>
      )}

      <div className={styles.workspaceGrid}>
        <section className={styles.queuePanel} aria-labelledby="queue-title">
          <div className={styles.sectionHeader}>
            <div>
              <Text size="xs" color="brand" case="uppercase" weight="bold">
                Fila de trabalho
              </Text>
              <Heading id="queue-title" level={2} size="md">
                Aguardando atenção
              </Heading>
            </div>
            {isQueueLoading && <Text size="sm" color="muted" role="status">Carregando…</Text>}
          </div>

          {!isQueueLoading && interests.length === 0 && !queueError && (
            <Card className={styles.emptyState} variant="flat">
              <Text weight="semibold">Nada por aqui ainda.</Text>
              <Text size="sm" color="muted">
                Não há solicitações nesse status. Tente visualizar todas para ampliar a busca.
              </Text>
              {filter !== 'ALL' && (
                <Button variant="outline" size="sm" onClick={() => setFilter('ALL')}>
                  Ver todas
                </Button>
              )}
            </Card>
          )}

          <div className={styles.queueList}>
            {interests.map((interest) => {
              const meta = statusMeta[interest.status]
              const isSelected = interest.id === selectedId
              return (
                <button
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`Abrir solicitação de ${interest.company.name}`}
                  className={`${styles.queueItem} ${isSelected ? styles.queueItemSelected : ''}`}
                  key={interest.id}
                  onClick={() => {
                    setSaveSuccess(false)
                    void openInterest(interest.id)
                  }}
                  type="button"
                >
                  <span className={styles.queueItemTopline}>
                    <span className={styles.companyName}>{interest.company.name}</span>
                    <Badge size="sm" variant={meta.variant}>{meta.label}</Badge>
                  </span>
                  <span className={styles.queueItemMeta}>
                    {interest.contactName} · {interest.unitCount} {interest.unitCount === 1 ? 'unidade' : 'unidades'}
                  </span>
                  <span className={styles.queueItemDate}>{formatDate(interest.createdAt)}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.detailPanel} aria-labelledby="detail-title">
          {!selectedId && (
            <div className={styles.detailPlaceholder}>
              <span className={styles.placeholderMark}>↗</span>
              <Heading id="detail-title" level={2} size="md">
                Escolha uma solicitação
              </Heading>
              <Text color="muted">
                O contexto completo aparece aqui para você decidir o próximo contato.
              </Text>
            </div>
          )}

          {selectedId && isDetailLoading && (
            <Text role="status">Carregando detalhes…</Text>
          )}

          {selectedId && detailError && !isDetailLoading && (
            <div className={styles.detailError}>
              <Alert variant="error" title="Detalhe indisponível">{detailError}</Alert>
              <Button variant="outline" onClick={() => void openInterest(selectedId)}>
                Tentar novamente
              </Button>
            </div>
          )}

          {selected && !isDetailLoading && !detailError && (
            <InterestDetail
              interest={selected}
              notes={notes}
              onNotesChange={setNotes}
              onStatusChange={(value) => {
                setStatus(value as SubscriptionInterestStatus)
                setSaveSuccess(false)
              }}
              onBack={closeInterest}
              onSave={() => void handleSave()}
              saveError={saveError}
              saveSuccess={saveSuccess}
              status={status}
              isSaving={isSaving}
            />
          )}
        </section>
      </div>
    </section>
  )
}

function InterestDetail({
  interest,
  notes,
  onNotesChange,
  onStatusChange,
  onBack,
  onSave,
  saveError,
  saveSuccess,
  status,
  isSaving,
}: {
  interest: SubscriptionInterest
  notes: string
  onNotesChange: (value: string) => void
  onStatusChange: (value: string) => void
  onBack: () => void
  onSave: () => void
  saveError: string | null
  saveSuccess: boolean
  status: SubscriptionInterestStatus
  isSaving: boolean
}) {
  const meta = statusMeta[interest.status]

  return (
    <div className={styles.detailContent}>
      <div className={styles.detailTopline}>
        <Button className={styles.backButton} size="sm" variant="ghost" onClick={onBack}>
          ← Voltar para a fila
        </Button>
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </div>
      <div className={styles.detailHeading}>
        <div>
          <Text size="sm" color="brand" weight="bold">Solicitação Rede</Text>
          <Heading id="detail-title" level={2}>
            {interest.company.name}
          </Heading>
          <Text color="muted">
            Enviada em {formatDate(interest.createdAt)} por {interest.requestedBy.name}.
          </Text>
        </div>
        <div className={styles.unitCount}>
          <strong>{interest.unitCount}</strong>
          <span>{interest.unitCount === 1 ? 'unidade' : 'unidades'}</span>
        </div>
      </div>

      <dl className={styles.contactGrid}>
        <div><dt>Contato</dt><dd>{interest.contactName}</dd></div>
        <div><dt>Canal preferido</dt><dd>{formatContactMethod(interest.preferredContactMethod)}</dd></div>
        <div><dt>E-mail</dt><dd><a href={`mailto:${interest.contactEmail}`}>{interest.contactEmail}</a></dd></div>
        {interest.contactPhone && <div><dt>Telefone</dt><dd><a href={`tel:${interest.contactPhone}`}>{interest.contactPhone}</a></dd></div>}
      </dl>

      <div className={styles.detailSection}>
        <Text size="sm" color="muted" weight="bold">O que essa operação precisa</Text>
        <Text className={styles.longText}>{interest.needs}</Text>
      </div>
      {interest.desiredFeatures && (
        <div className={styles.detailSection}>
          <Text size="sm" color="muted" weight="bold">Funcionalidades desejadas</Text>
          <Text className={styles.longText}>{interest.desiredFeatures}</Text>
        </div>
      )}

      <div className={styles.statusEditor}>
        <div>
          <Text size="sm" color="muted" weight="bold">Próximo passo</Text>
          <Text size="sm" color="muted">Atualize o status para o restante do time.</Text>
        </div>
        <FormField label="Status" labelVariant="compact">
          <Select options={statusOptions} value={status} onValueChange={onStatusChange} />
        </FormField>
        <FormField label="Nota interna" labelVariant="compact" helperText="Visível apenas para o time Nino.">
          <textarea
            className={styles.notesInput}
            maxLength={4000}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Ex.: ligar na terça pela manhã"
            rows={3}
            value={notes}
          />
        </FormField>
        {saveError && <Alert variant="error" title="Não foi possível salvar">{saveError}</Alert>}
        {saveSuccess && <p className={styles.successMessage} role="status">Status atualizado com sucesso.</p>}
        <Button loading={isSaving} onClick={onSave}>Salvar status</Button>
      </div>
    </div>
  )
}
