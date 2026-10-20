import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { QRCode } from '@nino/ds/components/QRCode'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import type { DiningTable } from '@shared/types/settings/dining-table'

import local from './DiningTables.module.css'

type DiningTablesProps = {
  tables: DiningTable[]
  unitSlug: string
  isPending: boolean
  isAdding: boolean
  togglingId?: string
  onAdd: (data: { quantity: number; prefix?: string }) => void
  onToggle: (data: { id: string; isActive: boolean }) => void
  onRemove: (id: string) => void
  removingId?: string
  showList?: boolean
}

export const DiningTables = ({
  tables,
  unitSlug,
  isPending,
  isAdding,
  togglingId,
  onAdd,
  onToggle,
  onRemove,
  removingId,
  showList = true,
}: DiningTablesProps) => {
  const [quantity, setQuantity] = useState<number | ''>(1)
  const [prefix, setPrefix] = useState('Mesa')
  const canAdd = typeof quantity === 'number' && quantity > 0

  const add = () => {
    if (!canAdd) return
    onAdd({ quantity, prefix: prefix.trim() || 'Mesa' })
  }

  return (
    <Box as="section" className={local.diningTablesSection}>
      <Box className={local.diningTablesForm}>
        <FormField label="Quantidade" className={local.quantity}>
          <NumberInput
            value={quantity}
            min={1}
            max={200}
            onValueChange={setQuantity}
          />
        </FormField>
        <FormField label="Prefixo" className={local.prefix}>
          <Input
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
          />
        </FormField>
        <Button disabled={!canAdd} loading={isAdding} onClick={add}>
          Gerar mesas
        </Button>
      </Box>

      {showList && (
        <DiningTablesList
          tables={tables}
          unitSlug={unitSlug}
          isPending={isPending}
          togglingId={togglingId}
          onToggle={onToggle}
          onRemove={onRemove}
          removingId={removingId}
        />
      )}
    </Box>
  )
}

type DiningTablesListProps = Pick<
  DiningTablesProps,
  | 'tables'
  | 'unitSlug'
  | 'isPending'
  | 'togglingId'
  | 'onToggle'
  | 'onRemove'
  | 'removingId'
>

export const DiningTablesList = ({
  tables,
  unitSlug,
  isPending,
  togglingId,
  onToggle,
  onRemove,
  removingId,
}: DiningTablesListProps) => {
  const [tableToRemove, setTableToRemove] = useState<DiningTable | null>(null)
  const [tableToPreview, setTableToPreview] = useState<DiningTable | null>(null)

  const qrUrl = (table: DiningTable) =>
    `https://${unitSlug}.dev.nino.delivery/?mesa=${encodeURIComponent(table.publicKey)}`

  return (
    <>
      {isPending && <Skeleton className={local.diningTablesEmpty} />}

      {!isPending && tables.length === 0 && (
        <EmptyState className={local.diningTablesEmpty}>
          Nenhuma mesa cadastrada nesta unidade.
        </EmptyState>
      )}

      {!isPending && tables.length > 0 && (
        <Box className={local.tableShell}>
          <Table>
            <TableHeader>
              <TableRow className={local.headRow}>
                <TableHead className={local.colName}>Mesa</TableHead>
                <TableHead className={local.colStatus}>Status</TableHead>
                <TableHead className={local.colQr}>QR Code</TableHead>
                <TableHead className={local.colActions}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className={local.colName}>
                    <Text as="span" className={local.tableName}>
                      {table.name}
                    </Text>
                  </TableCell>
                  <TableCell className={local.colStatus}>
                    <Badge
                      variant={table.isActive ? 'success' : 'default'}
                      size="sm"
                    >
                      {table.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className={local.colQr}>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Ver QR Code da ${table.name}`}
                      onClick={() => setTableToPreview(table)}
                    >
                      <Icon name="eye" size="sm" />
                    </Button>
                  </TableCell>
                  <TableCell className={local.colActions}>
                    <Box direction="row" className={local.diningTablesActions}>
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={togglingId === table.id}
                        onClick={() =>
                          onToggle({
                            id: table.id,
                            isActive: !table.isActive,
                          })
                        }
                      >
                        {table.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={removingId === table.id}
                        onClick={() => setTableToRemove(table)}
                      >
                        Remover
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog
        open={!!tableToRemove}
        onOpenChange={(open) => {
          if (!open) setTableToRemove(null)
        }}
        title={`Remover ${tableToRemove?.name ?? 'mesa'}?`}
        description="O QR Code deixará de funcionar e esta ação não pode ser desfeita."
        confirmLabel="Remover mesa"
        cancelLabel="Manter mesa"
        loading={!!tableToRemove && removingId === tableToRemove.id}
        onConfirm={() => {
          if (!tableToRemove) return
          onRemove(tableToRemove.id)
          setTableToRemove(null)
        }}
        onCancel={() => setTableToRemove(null)}
      />

      <Modal
        open={!!tableToPreview}
        onOpenChange={(open) => {
          if (!open) setTableToPreview(null)
        }}
        size="sm"
        header={
          <Heading level={2} size="md">
            QR Code da {tableToPreview?.name}
          </Heading>
        }
        body={
          tableToPreview && (
            <Box align="center" className={local.qrPreview}>
              <QRCode
                value={qrUrl(tableToPreview)}
                size={224}
                label={`QR Code da ${tableToPreview.name}`}
              />
            </Box>
          )
        }
      />
    </>
  )
}
