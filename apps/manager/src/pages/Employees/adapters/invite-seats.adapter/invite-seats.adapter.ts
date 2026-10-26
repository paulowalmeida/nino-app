import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const COURIER_SEAT = 'COURIER'

export type InviteSeat = {
  value: string
  label: string
}

const COURIER_SEAT_OPTION: InviteSeat = {
  value: COURIER_SEAT,
  label: 'Entregador',
}

/**
 * Um assento por cargo concedível, do mais baixo ao mais alto, e por último o
 * entregador, que não tem cargo. O primeiro é o padrão do formulário.
 */
export const inviteSeatsOf = (assignable: UnitPosition[]): InviteSeat[] => [
  ...[...assignable]
    .sort((first, second) => first.level - second.level)
    .map(({ id, name }) => ({ value: id, label: name })),
  COURIER_SEAT_OPTION,
]
