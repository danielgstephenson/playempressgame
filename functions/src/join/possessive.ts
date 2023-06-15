export default function joinPossessive (values: string[] | number[]): string {
  const possessives = values.map(value => String(value).toLowerCase() === 'you' ? 'Your' : `${value}'s`)
  if (possessives.length === 0) {
    return ''
  }
  if (possessives.length === 1) {
    return String(possessives[0])
  }
  if (possessives.length === 2) {
    return possessives.join(' and ')
  }
  const copy = [...possessives]
  const last = String(copy.pop())
  const first = copy.join(', ')
  const joined = `${first}, and ${last}`
  return joined
}
