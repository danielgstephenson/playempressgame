import { https } from "firebase-functions";
import { Transaction } from "firelord";
import { gamesLord, usersLord } from "../db";
import { JoinedGameGuard } from "../types";
import guardCurrentUid from "./currentUid";
import guardDocData from "./docData";
import guardUserJoined from "./userJoined";

export default async function guardJoinedGame ({ context, gameId, transaction }: {
  context: https.CallableContext
  gameId: string
  transaction: Transaction
}): Promise<JoinedGameGuard> {
  const currentUid = guardCurrentUid({ context })
  const gameRef = gamesLord.doc(gameId)
  const gameData = await guardDocData({
    docRef: gameRef,
    transaction
  })
  guardUserJoined({ gameData,userId: currentUid })
  const userRef = usersLord.doc(currentUid)
  return { gameData, gameRef, currentUid, userRef }
}