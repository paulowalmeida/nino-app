// @vitest-environment node

import { describe, expect, it } from 'vitest'

import config from './vite.config'

describe('manager Vite dependency optimization', () => {
  it('scans lazy route source files before accepting navigation', () => {
    expect(config.optimizeDeps?.entries).toEqual([
      'index.html',
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/*.mock.{ts,tsx}',
      '!src/test/**',
    ])
  })
})
