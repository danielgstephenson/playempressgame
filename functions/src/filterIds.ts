export default function filterIds <T extends { id: string }> (
  a: T[], b: T[]
): T[] {
  const filtered = a.filter(
    aElement => b.every(bElement => aElement.id !== bElement.id)
  )
  return filtered
}
