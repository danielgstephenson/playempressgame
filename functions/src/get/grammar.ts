import { Grammar } from '../types'

export default function getGrammar (number: number, singular: string = 'scheme', plural: string = 'scheme'): Grammar {
  if (number === 1) {
    const count = `${number} ${singular}`
    const phrase = `is ${count}`
    return { verb: 'is', noun: singular, count, phrase, object: 'it', all: 'it' }
  }
  const count = `${number} ${plural}`
  const phrase = `are ${count}`
  return { verb: 'are', noun: plural, count, phrase, object: 'them', all: 'them all' }
}
