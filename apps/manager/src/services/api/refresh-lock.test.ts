import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { refreshOnce } from './refresh-lock'

/**
 * jsdom não implementa Web Locks. Este mock reproduz a única garantia que o
 * código depende dela: chamadas com o mesmo nome entram numa fila e rodam uma
 * de cada vez — a mesma coisa que o navegador faz entre abas de verdade.
 */
const installLockQueue = () => {
  const queue: Array<() => Promise<void>> = []
  let busy = false

  const drain = async () => {
    if (busy) return
    busy = true
    while (queue.length > 0) await queue.shift()!()
    busy = false
  }

  const request = vi.fn(
    (_name: string, callback: () => Promise<unknown>) =>
      new Promise((resolve, reject) => {
        queue.push(async () => {
          try {
            resolve(await callback())
          } catch (error) {
            reject(error as Error)
          }
        })
        void drain()
      })
  )

  vi.stubGlobal('navigator', { locks: { request } })
  return request
}

describe('refreshOnce', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('renews once when several tabs expire together', async () => {
    installLockQueue()
    const renew = vi.fn().mockResolvedValue(true)

    const results = await Promise.all([
      refreshOnce(renew),
      refreshOnce(renew),
      refreshOnce(renew),
    ])

    expect(results).toEqual([true, true, true])
    expect(renew).toHaveBeenCalledTimes(1)
  })

  it('takes the queued turn without renewing again, since the cookie is fresh', async () => {
    installLockQueue()
    const renew = vi.fn().mockResolvedValue(true)

    await refreshOnce(renew)
    /* uma aba distinta, chamando depois que a primeira já passou */
    const secondCall = refreshOnce(renew)

    expect(await secondCall).toBe(true)
    expect(renew).toHaveBeenCalledTimes(1)
  })

  it('renews again once the fresh window has passed', async () => {
    installLockQueue()
    const renew = vi.fn().mockResolvedValue(true)

    await refreshOnce(renew)
    vi.advanceTimersByTime(6000)
    await refreshOnce(renew)

    expect(renew).toHaveBeenCalledTimes(2)
  })

  it('lets the next tab try again after a failed renewal', async () => {
    installLockQueue()
    const renew = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true)

    expect(await refreshOnce(renew)).toBe(false)
    expect(await refreshOnce(renew)).toBe(true)
    expect(renew).toHaveBeenCalledTimes(2)
  })

  it('falls back to a same-tab lock when Web Locks is unavailable', async () => {
    vi.stubGlobal('navigator', {})
    let resolve: (value: boolean) => void = () => {}
    const pending = new Promise<boolean>((r) => {
      resolve = r
    })
    const renew = vi.fn().mockReturnValue(pending)

    const calls = [refreshOnce(renew), refreshOnce(renew)]
    resolve(true)

    expect(await Promise.all(calls)).toEqual([true, true])
    expect(renew).toHaveBeenCalledTimes(1)
  })
})
