import yeast from 'yeast'

export function createId (): string {
  return yeast().split('').reverse().join('')
}
