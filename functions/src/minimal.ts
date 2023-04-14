import { getFirelord, getFirestore, MetaTypeCreator, runTransaction, PossiblyReadAsUndefined } from 'firelord'
import { initializeApp } from 'firebase-admin'
import { firebaseConfig } from './secret'
import { https } from 'firebase-functions'
type User = MetaTypeCreator<{
  name: string
  friendNames: string[] | PossiblyReadAsUndefined
}, 'users'>
initializeApp(firebaseConfig)
const db = getFirestore()
const usersLord = getFirelord<User>(db, 'users')
export const cloudFunction = https.onCall(async (props, context) => {
  await runTransaction(async transaction => {
    const userRef = usersLord.doc('someId')
    transaction.set(userRef, { name: 'someName' }, { merge: true })
    // Argument of type '{}' is not assignable to parameter of type '{ friendNames: readonly string[] | ArrayUnionOrRemove<string>; }'.
    //  Property 'friendNames' is missing in type '{}' but required in type '{ friendNames: readonly string[] | ArrayUnionOrRemove<string>; }'.
  })
})
