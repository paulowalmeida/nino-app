import { expect, it } from 'vitest'
import { brl } from './money'
it('formats BRL', () => expect(brl(10)).toContain('10'))
