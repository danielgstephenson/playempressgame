import { Grammar } from '../types'

export default function getGrammar (number: number, singular: string = 'scheme', plural: string = 'scheme'): Grammar {
  if (number === 1) {
    const count = `${number} ${singular}`
    const toBeCount = `is ${count}`
    return { toBe: 'is', noun: singular, count, toBeCount, object: 'it', all: 'it' }
  }
  const count = `${number} ${plural}`
  const toBeCount = `are ${count}`
  return { toBe: 'are', noun: plural, count, toBeCount, object: 'them', all: 'them all' }
}
