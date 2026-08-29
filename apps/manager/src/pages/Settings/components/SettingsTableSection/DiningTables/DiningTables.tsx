import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { QRCode } from '@nino/ds/components/QRCode'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { DiningTable } from '@shared/types/settings/dining-table'

import local from './DiningTables.module.css'

type DiningTablesProps = {
  tables: DiningTable[]
  tenantSlug: string
  isPending: boolean
  isAdding: boolean
  togglingId?: string
  onAdd: (data: { quantity: number; prefix?: string }) => void
  onToggle: (data: { id: string; isActive: boolean }) => void
}

export const DiningTables = ({
  tables,
  tenantSlug,
  isPending,
  isAdding,
  togglingId,
  onAdd,
  onToggle,
}: DiningTablesProps) => {
  const [quantity, setQuantity] = useState<number | ''>(1)
  const [prefix, setPrefix] = useState('Mesa')
  const canAdd = typeof quantity === 'number' && quantity > 0

  const add = () => {
    if (!canAdd) return
    onAdd({ quantity, prefix: prefix.trim() || 'Mesa' })
  }

  const qrUrl = (table: DiningTable) =>
    `https://${tenantSlug}.dev.nino.delivery/?mesa=${encodeURIComponent(table.publicKey)}`

  return (
    <Box as="section" className={local.section}>
      <Box className={local.head}>
        <Heading level={3} size="lg">
          Mesas da unidade
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Gere várias mesas de uma vez. O Nino numera cada mesa e cria seu QR
          Code automaticamente.
        </Text>
      </Box>

      <Box className={local.form}>
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

      {isPending && <Skeleton className={local.empty} />}

      {!isPending && tables.length === 0 && (
        <EmptyState className={local.empty}>
          Nenhuma mesa cadastrada nesta unidade.
        </EmptyState>
      )}

      {!isPending && tables.length > 0 && (
        <ul className={local.list}>
          {tables.map((table) => (
            <li key={table.id} className={local.row}>
              <QRCode
                value={qrUrl(table)}
                size={96}
                label={`QR Code da ${table.name}`}
              />
              <Box className={local.rowInfo}>
                <Text className={local.name}>{table.name}</Text>
                <Text size="sm" color="muted" className={local.meta}>
                  Escaneie para testar o cardápio desta mesa.
                </Text>
              </Box>
              <Box className={local.actions}>
                <Badge
                  variant={table.isActive ? 'success' : 'default'}
                  size="sm"
                >
                  {table.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  loading={togglingId === table.id}
                  onClick={() =>
                    onToggle({ id: table.id, isActive: !table.isActive })
                  }
                >
                  {table.isActive ? 'Desativar' : 'Ativar'}
                </Button>
              </Box>
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
