import { https } from 'firebase-functions'
import { Scheme } from '../types'

export default function guardPlayId ({ hand, id }: {
  hand: Scheme[]
  id: string
}): void {
  if (hand.every(scheme => scheme.id !== id)) {
    throw new https.HttpsError(
      'not-found',
      'The player\'s hand does not contain this scheme.'
    )
  }
}
