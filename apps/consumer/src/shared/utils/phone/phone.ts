import { maskPhone } from '@nino/ds/masks'

/**
 * Como a API guarda: +55 seguido de DDD e número. O painel do gestor grava
 * assim (e o `tel:` do detalhe do pedido depende disso), então a vitrine
 * precisa mandar no mesmo formato — aceita o que a pessoa digitar, com
 * máscara ou sem.
 */
export const toE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  return digits ? `+55${digits}` : ''
}

/** Um celular brasileiro tem 10 (fixo) ou 11 (móvel) dígitos com DDD. */
export const isCompletePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  return digits.length === 10 || digits.length === 11
}

/**
 * Como a pessoa lê o próprio número. A API guarda em E.164 (`+5591988881234`),
 * que é formato de máquina — na tela ele volta para a máscara que ela digitou.
 */
export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  return maskPhone(digits) || phone
}
