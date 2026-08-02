import { describe, expect, it, vi } from 'vitest'

import { refreshOnce } from './refresh-lock'

const deferred = () => {
  let resolve: (value: boolean) => void = () => {}
  const promise = new Promise<boolean>((r) => {
    resolve = r
  })

  return { promise, resolve }
}

describe('refreshOnce', () => {
  it('renews once when several requests expire together', async () => {
    const { promise, resolve } = deferred()
    const renew = vi.fn().mockReturnValue(promise)

    const calls = [refreshOnce(renew), refreshOnce(renew), refreshOnce(renew)]
    resolve(true)

    expect(await Promise.all(calls)).toEqual([true, true, true])
    expect(renew).toHaveBeenCalledTimes(1)
  })

  it('renews again on the next expiry, not once per session', async () => {
    const renew = vi.fn().mockResolvedValue(true)

    await refreshOnce(renew)
    await refreshOnce(renew)

    expect(renew).toHaveBeenCalledTimes(2)
  })

  /* Sem isto, uma renovação falha travaria o lock e ninguém mais tentaria. */
  it('frees the lock when the renewal fails', async () => {
    const renew = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(true)

    await expect(refreshOnce(renew)).rejects.toThrow('offline')

    expect(await refreshOnce(renew)).toBe(true)
    expect(renew).toHaveBeenCalledTimes(2)
  })
})
