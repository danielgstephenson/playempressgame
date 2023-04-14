import { https } from 'firebase-functions'
import { Game } from '../types'

export default function guardJoinPhase ({
  gameData
}: {
  gameData: Game['read']
}): void {
  if (gameData.phase !== 'join') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game has already started.'
    )
  }
}
