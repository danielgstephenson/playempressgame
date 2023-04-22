import { https } from 'firebase-functions/v1'
import { Player, Result, Scheme } from '../types'
import guardScheme from './scheme'

export default function guardPlayScheme (player: Result<Player>): Scheme {
  if (player.playScheme == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are not playing a scheme'
    )
  }
  const playScheme = guardScheme({
    ref: player.playScheme
  })
  return playScheme
}
