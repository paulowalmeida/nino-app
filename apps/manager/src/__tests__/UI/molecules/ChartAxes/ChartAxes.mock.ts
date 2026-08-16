import { scaleLinear, scaleTime } from '@visx/scale'

export const xScale = scaleTime<number>({
  domain: [new Date('2026-07-01'), new Date('2026-07-05')],
  range: [0, 200],
})

export const yScale = scaleLinear<number>({
  domain: [0, 100],
  range: [80, 0],
  nice: true,
})
