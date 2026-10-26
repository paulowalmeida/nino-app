import { expect, it } from 'vitest'
import { resolveBackHref } from './resolve-back-href'
it('builds the store path', () => expect(resolveBackHref('loja')).toBe('/loja'))
