export default function guardNumber (value: unknown, label: string): number {
  if (typeof value !== 'number') {
    throw new Error(`${label} must be a number`)
  }
  return value
}
