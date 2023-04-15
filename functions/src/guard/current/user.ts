import { https } from 'firebase-functions'
import { Transaction } from 'firelord'
import { usersRef } from '../../db'
import guardDocData from '../docData'
import guardCurrentUid from './uid'
import { CurrentUserGuard } from '../../types'

export default async function guardCurrentUser ({ context, transaction }: {
  context: https.CallableContext
  transaction: Transaction
}): Promise<CurrentUserGuard> {
  const currentUid = guardCurrentUid({ context })
  const currentUserRef = usersRef.doc(currentUid)
  const currentUserData = await guardDocData({
    docRef: currentUserRef,
    transaction
  })
  const currentUser = { id: currentUid, ...currentUserData }
  return { currentUserRef, currentUserData, currentUid, currentUser }
}
