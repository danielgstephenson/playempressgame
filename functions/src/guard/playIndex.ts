import { https } from "firebase-functions"

export default function guardPlayIndex ({ hand, index }: {
  hand: number[] 
  index: number
}) {
  if (hand.length <= index) {
    throw new https.HttpsError(
      'out-of-range',
      `The player's hand is too small.`
    )
  }
}