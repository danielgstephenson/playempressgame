export default function getJoined (values: string[] | number[]): string {
  if (values.length === 0) {
    return ''
  }
  if (values.length === 1) {
    return String(values[0])
  }
  if (values.length === 2) {
    return values.join(' and ')
  }
  const copy = [...values]
  const last = String(copy.pop())
  const first = copy.join(', ')
  const joined = `${first}, and ${last}`
  return joined
}
