import yeast from 'yeast'

export default function createId (): string {
  return yeast()
    .split('')
    .reverse()
    .join('')
    .replaceAll('_', '~')
}
