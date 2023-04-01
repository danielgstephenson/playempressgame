import { https } from "firebase-functions/v1"
import checkCurrentUid from "../check/currentUid"
import checkDocData from "../check/docData"
import checkJoinPhase from "../check/joinPhase"
import { createCloudFunction } from "../createCloudFunction"
import { gamesRef, profilesRef, usersRef, playersRef } from "../db"
import admin from 'firebase-admin';
import checkUserJoined from "../check/userJoined"

const trashScheme = createCloudFunction(async (props, context, transaction) => {
  const currentUid = checkCurrentUid({ context })
  const {
    docData : userData
  } = await checkDocData({
    collectionRef: usersRef,
    docId: currentUid,
    transaction
  })
  const { 
    docData : gameData, 
    docRef : gameRef 
  } = await checkDocData({
    collectionRef: gamesRef,
    docId: props.gameId,
    transaction
  })
  checkUserJoined({gameData,userId: currentUid})
  if (gameData.phase !== 'play') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game is not in the play phase.'
    )
  }
  const playerId = `${currentUid}_${props.gameId}`
  const { 
    docData : playerData, 
    docRef : playerRef 
  } = await checkDocData({
    collectionRef: playersRef,
    docId: playerId,
    transaction
  })
  if (!playerData.hand.includes(props.schemeId)) {
    throw new https.HttpsError(
      'invalid-argument',
      `This scheme is not in the player's hand.`
    )
  }
  console.log(`trashing scheme ${props.schemeId}...`)
  transaction.update(playerRef, {
    trashScheme: props.schemeId
  })
  const profileRef = profilesRef.doc(playerId)
  transaction.update(profileRef, {
    trashReady: true
  })
  console.log(`trashed scheme ${props.schemeId}!`)
})
export default trashScheme