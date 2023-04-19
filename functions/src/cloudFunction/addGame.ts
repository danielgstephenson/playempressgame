import createCloudFunction from '../create/cloudFunction'
import createId from '../create/id'
import { gamesRef } from '../db'
import createEvent from '../create/event'
import { serverTimestamp } from 'firelord'
import { Game } from '../types'
import guardCurrentUser from '../guard/current/user'

const addGame = createCloudFunction(async (props, context, transaction) => {
  console.info('Adding game...')
  const { currentUser } = await guardCurrentUser({ context, transaction })
  const id = createId()
  const newData: Game['write'] = {
    name: id,
    createdAt: serverTimestamp(),
    choices: [],
    phase: 'join',
    users: [],
    court: [],
    dungeon: [],
    timeline: [],
    history: [createEvent(`${currentUser.displayName} created game ${id}.`)],
    readyCount: 0
  }
  const gameRef = gamesRef.doc(id)
  transaction.create(gameRef, newData)
  console.info(`Added game with id ${id}`)
})
export default addGame
