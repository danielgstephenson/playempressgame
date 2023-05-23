import { https } from 'firebase-functions'
import { Game } from '../types'

export default function guardUserJoined ({
  gameData,
  userId
}: {
  gameData: Game['read']
  userId: string
}): void {
  const user = gameData.profiles.find((profile) => profile.userId === userId)
  if (user == null) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has not joined the game.'
    )
  }
}
