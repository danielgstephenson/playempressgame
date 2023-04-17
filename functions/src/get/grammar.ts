import { Grammar } from '../types'

export default function getGrammar (number: number, singular: string, plural: string): Grammar {
  if (number === 1) {
    const count = `${number} ${singular}`
    const phrase = `is ${count}`
    return { verb: 'is', noun: singular, count, phrase, object: 'it' }
  }
  const count = `${number} ${plural}`
  const phrase = `are ${count}`
  return { verb: 'are', noun: plural, count, phrase, object: 'them' }
}
