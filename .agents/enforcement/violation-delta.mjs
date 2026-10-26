export const introducedViolations = (current, baseline = []) => {
  const remaining = new Map()
  baseline.forEach((violation) => {
    remaining.set(violation, (remaining.get(violation) ?? 0) + 1)
  })

  return current.filter((violation) => {
    const count = remaining.get(violation) ?? 0
    if (count === 0) return true
    remaining.set(violation, count - 1)
    return false
  })
}
