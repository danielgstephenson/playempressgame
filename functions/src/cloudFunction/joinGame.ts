import { https } from "firebase-functions/v1"
import guardCurrentUid from "../guard/currentUid"
import guardDocData from "../guard/docData"
import guardJoinPhase from "../guard/joinPhase"
import { createCloudFunction } from "../create/cloudFunction"
import { gamesLord, profilesLord, usersLord } from "../db"
import admin from 'firebase-admin';
import { createEvent } from "../create/event"
import { JoinGameProps } from "../types"
import { arrayUnion } from "firelord"

const joinGame = createCloudFunction<JoinGameProps>(async (props, context, transaction) => {
  const currentUid = guardCurrentUid({ context })
  const gameRef = gamesLord.doc(props.gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
    transaction
  })
  const userRef = usersLord.doc(currentUid)
  const userData = await guardDocData({
    docRef: userRef,
    transaction
  })
  if (gameData.userIds.includes(currentUid)) {
    throw new https.HttpsError(
      'failed-precondition',
      'This user has already joined the game.'
    )
  }
  guardJoinPhase({gameData})
  console.log(`joining game ${props.gameId}...`)
  const profileId = `${currentUid}_${props.gameId}`
  const profileRef = profilesLord.doc(profileId)
  transaction.set(profileRef, {
    userId: currentUid,
    gameId: props.gameId,
    displayName: userData.displayName,
  }, { merge: true })
  transaction.update(gameRef, {
    userIds: arrayUnion(currentUid),
    history: arrayUnion(
      createEvent(`${userData.displayName} joined game ${props.gameId}`)
    )
  })
  console.log(`joined game ${props.gameId}!`)
})
export default joinGame