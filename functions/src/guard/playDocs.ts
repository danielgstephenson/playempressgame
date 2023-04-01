import { Transaction, DocumentReference, DocumentData } from "firebase-admin/firestore"
import { https } from "firebase-functions"
import { usersRef, gamesRef, playersRef, profilesRef } from "../db"
import guardCurrentUid from "./currentUid"
import guardDocData from "./docData"
import guardUserJoined from "./userJoined"

interface PlayRefs {
  playerData: DocumentData
  playerRef: DocumentReference
  profileRef: DocumentReference
}

export default async function guardPlayDocs ({
  context, transaction, gameId
}: {
  context: https.CallableContext
  transaction: Transaction
  gameId: string
}): Promise<PlayRefs> {
  const currentUid = guardCurrentUid({ context })
  const {
    docData : userData
  } = await guardDocData({
    collectionRef: usersRef,
    docId: currentUid,
    transaction
  })
  const { 
    docData : gameData, 
    docRef : gameRef 
  } = await guardDocData({
    collectionRef: gamesRef,
    docId: gameId,
    transaction
  })
  guardUserJoined({gameData,userId: currentUid})
  if (gameData.phase !== 'play') {
    throw new https.HttpsError(
      'failed-precondition',
      'This game is not in the play phase.'
    )
  }
  const playerId = `${currentUid}_${gameId}`
  const { 
    docData: playerData, 
    docRef: playerRef 
  } = await guardDocData({
    collectionRef: playersRef,
    docId: playerId,
    transaction
  })
  const profileRef = profilesRef.doc(playerId)
  return { playerRef, playerData, profileRef }
}