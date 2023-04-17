import { getFirelord, getFirestore, MetaTypeCreator, PossiblyReadAsUndefined, arrayUnion, updateDoc, DocumentReference } from 'firelord'
import { initializeApp } from 'firebase-admin'
import { firebaseConfig } from './secret'
import { https } from 'firebase-functions'
type User = MetaTypeCreator<{
  name: string
  friendNames: string[] | PossiblyReadAsUndefined
}, 'users'>
initializeApp(firebaseConfig)
const db = getFirestore()
const usersRef = getFirelord<User>(db, 'users')
function getChanges (userRef: DocumentReference<User>): Partial<User['write']> {
  const changes: Partial<User['write']> = { friendNames: arrayUnion('someName') }
  if (userRef.id === 'someId') {
    changes.name = 'someOtherName'
  }
  return changes
}
export const cloudFunction = https.onCall(async (props, context) => {
  const userRef = usersRef.doc('someId')

  const changes = getChanges(userRef)
  await updateDoc(userRef, changes)
})
