import { toast } from '@nino/ds/components/Toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryClient } from './query-client'

const errorToast = vi.spyOn(toast, 'error').mockImplementation(() => '')
const successToast = vi.spyOn(toast, 'success').mockImplementation(() => '')

const run = (
  meta: Record<string, unknown> | undefined,
  outcome: 'resolve' | 'reject'
) =>
  queryClient
    .getMutationCache()
    .build(queryClient, {
      meta,
      mutationFn: () =>
        outcome === 'resolve'
          ? Promise.resolve('ok')
          : Promise.reject(new Error('network error')),
    })
    .execute(undefined)
    .catch(() => undefined)

describe('query-client feedback', () => {
  beforeEach(() => {
    errorToast.mockClear()
    successToast.mockClear()
  })

  it('announces a failure that no hook handled', async () => {
    await run(undefined, 'reject')

    expect(errorToast).toHaveBeenCalledWith(
      'Não deu pra salvar',
      expect.any(String)
    )
  })

  it('uses the title the mutation chose for its failure', async () => {
    await run({ errorTitle: 'A loja continua aberta' }, 'reject')

    expect(errorToast).toHaveBeenCalledWith(
      'A loja continua aberta',
      expect.any(String)
    )
  })

  it('stays quiet when the screen already shows the error', async () => {
    await run({ silentError: true }, 'reject')

    expect(errorToast).not.toHaveBeenCalled()
  })

  it('confirms success only when the mutation named it', async () => {
    await run({ success: 'Loja fechada' }, 'resolve')
    await run(undefined, 'resolve')

    expect(successToast).toHaveBeenCalledOnce()
    expect(successToast).toHaveBeenCalledWith('Loja fechada')
  })
})
