export default function guardDefined <T> (value: T, label: string): NonNullable<T> {
  if (value == null) {
    throw new Error(`${label} is not defined`)
  }
  return value
}
