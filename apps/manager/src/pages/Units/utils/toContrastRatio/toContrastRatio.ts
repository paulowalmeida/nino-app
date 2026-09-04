const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

const toChannels = (color: string) => {
  const digits = color.trim().match(HEX_PATTERN)?.[1]
  if (!digits) return null

  const full =
    digits.length === 3
      ? digits
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : digits

  return [0, 2, 4].map((start) =>
    Number.parseInt(full.slice(start, start + 2), 16)
  )
}

const toLuminanceChannel = (channel: number) => {
  const ratio = channel / 255
  return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

const toLuminance = (channels: number[]) =>
  0.2126 * toLuminanceChannel(channels[0]) +
  0.7152 * toLuminanceChannel(channels[1]) +
  0.0722 * toLuminanceChannel(channels[2])

export const toContrastRatio = (foreground: string, background: string) => {
  const foregroundChannels = toChannels(foreground)
  const backgroundChannels = toChannels(background)
  if (!foregroundChannels || !backgroundChannels) return 1

  const first = toLuminance(foregroundChannels)
  const second = toLuminance(backgroundChannels)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)

  return (lighter + 0.05) / (darker + 0.05)
}
