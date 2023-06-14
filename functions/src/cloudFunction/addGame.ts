import createCloudFunction from '../create/cloudFunction'
import createId from '../create/id'
import { gamesRef } from '../db'
import { serverTimestamp } from 'firelord'
import guardCurrentUser from '../guard/current/user'
import addEvent from '../add/event'

const addGame = createCloudFunction(async (props, context, transaction) => {
  console.info('Adding game...')
  const { currentUser } = await guardCurrentUser({ context, transaction })
  const id = createId()
  const newData = {
    name: id,
    createdAt: serverTimestamp(),
    choices: [],
    phase: 'join' as const,
    profiles: [],
    court: [],
    dungeon: [],
    events: [],
    round: 1,
    timeline: []
  }
  addEvent(newData, `${currentUser.displayName} created game ${id}.`)
  const gameRef = gamesRef.doc(id)
  transaction.create(gameRef, newData)
  console.info(`Added game with id ${id}`)
})
export default addGame
