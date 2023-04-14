import { https } from 'firebase-functions'
import { Game } from '../types'

export default function guardUserJoined ({
  gameData,
  userId
}: {
  gameData: Game['read']
  userId: string
}): void {
  const user = gameData.users.find((user) => user.id === userId)
  if (user == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has not joined the game.'
    )
  }
}
