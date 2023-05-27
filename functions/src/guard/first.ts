import guardDefined from './defined'

export default function guardFirst <T> (value: T[], label: string): NonNullable<T> {
  guardDefined(value, label)
  const first = value[0]
  const defined = guardDefined(first, `(First) ${label}`)
  return defined
}
