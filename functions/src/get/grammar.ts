import { Grammar } from '../types'
import { numberToWords } from 'v-number-to-words'

export default function getGrammar (
  number: number,
  singular = 'scheme',
  plural = 'schemes'
): Grammar {
  const parts = number === 1
    ? {
        toBe: 'is',
        noun: singular,
        object: 'it',
        all: 'it',
        spelled: 'one'
      }
    : {
        toBe: 'are',
        noun: plural,
        object: 'them',
        all: 'them all',
        spelled: numberToWords(number)
      }
  const count = `${number} ${parts.noun}`
  const toBeCount = `${parts.toBe} ${count}`
  const possessivePhrase = `have ${count}`
  return {
    ...parts,
    count,
    possessivePhrase,
    toBeCount
  }
}
