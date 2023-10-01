import { Transaction, serverTimestamp } from 'firelord'
import addEvent from '../add/event'
import createId from '../create/id'
import { gamesRef } from '../db'
import guardCurrentUser from './current/user'
import { https } from 'firebase-functions'
import createProfile from '../create/profile'
import { Profile } from '../types'

export default async function guardNewGame ({
  bot,
  context,
  transaction
}: {
  bot?: boolean
  context: https.CallableContext
  transaction: Transaction
}): Promise<string> {
  const { currentUser } = await guardCurrentUser({ context, transaction })
  const gameId = createId()
  const profiles: Profile[] = []
  const newData = {
    name: gameId,
    createdAt: serverTimestamp(),
    choices: [],
    final: false,
    phase: 'join' as const,
    profiles,
    court: [],
    dungeon: [],
    events: [],
    imprisoned: false,
    round: 1,
    timeline: [],
    timePassed: false
  }
  if (bot === true) {
    const userId = createId()
    const profile = createProfile({
      displayName: userId,
      gameId,
      userId
    })
    if (newData.profiles == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'Profiles must be defined.'
      )
    }
    newData.profiles.push(profile)
  }
  addEvent(newData, `${currentUser.displayName} created game ${gameId}.`)
  const gameRef = gamesRef.doc(gameId)
  transaction.create(gameRef, newData)
  return gameId
}
