export default function join (values: string[] | number[], empty = ''): string {
  if (values.length === 0) {
    return empty
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
