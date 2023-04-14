import guardCurrentuid from '../guard/currentUid'
import { createCloudFunction } from '../create/cloudFunction'
import { createId } from '../create/id'
import { gamesRef } from '../db'
import { createEvent } from '../create/event'
import { serverTimestamp } from 'firelord'
import { AddGameProps } from '../types'

const addGame = createCloudFunction<AddGameProps>(async (props, context, transaction) => {
  guardCurrentuid({ context })
  const id = createId()
  const newData = {
    name: id,
    createdAt: serverTimestamp(),
    phase: 'join',
    userIds: [],
    court: [],
    dungeon: [],
    timeline: [],
    history: [createEvent(`${props.displayName} created game ${id}`)],
    readyCount: 0
  }
  const gameRef = gamesRef.doc(id)
  console.log(`adding game ${id}...`)
  transaction.create(gameRef, newData)
  console.log('game added!')
})
export default addGame
