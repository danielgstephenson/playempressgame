import schemes from '../schemes.json'

export default function getBg ({
  rank,
  weight = 700
}: {
  rank: number
  weight?: number
}): string {
  const scheme = schemes[rank]
  return `${scheme.color.toLowerCase()}.${weight}`
}
