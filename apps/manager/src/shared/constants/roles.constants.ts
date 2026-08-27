import type { TenantRole } from 'src/shared/types/auth/tenant-role'
/** Quem administra a loja: vê faturamento, equipe e configurações. */
export const MANAGERS: TenantRole[] = ['TENANT_OWNER', 'MANAGER']

/** Onde cada papel começa ao entrar — e para onde volta se tentar demais. */
export const HOME_OF: Record<TenantRole, string> = {
  TENANT_OWNER: 'visao-geral',
  MANAGER: 'visao-geral',
  STAFF: 'balcao',
}
