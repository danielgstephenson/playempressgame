import { FieldValue } from "firebase-admin/firestore"
import checkCurrentUid from "../guard/currentUid"
import { createCloudFunction } from "../createCloudFunction"
import { createId } from "../createId"
import { gamesRef } from "../db"

const addGame = createCloudFunction(async (props, context, transaction) => {
  checkCurrentUid({context})
  const id = createId()
  const newData = {
    name: id,
    createdAt: FieldValue.serverTimestamp(),
    phase: 'join',
    userIds: [],
    court: [],
    dungeon: [],
    timeline: []
  }
  const gameRef = gamesRef.doc(id)
  console.log(`adding game ${id}...`)
  transaction.set(gameRef, newData)
  console.log('game added!')
})
export default addGame