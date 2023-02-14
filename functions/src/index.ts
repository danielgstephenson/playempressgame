// import * as admin from "firebase-admin";
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { https, runWith, auth } from "firebase-functions"
import { firebaseConfig } from './secret'
import yeast from 'yeast'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

admin.initializeApp(firebaseConfig);
const adminAuth = getAuth()
const db = admin.firestore()
const games = db.collection('games')
const users = db.collection('users')

exports.hello = https.onCall((data, context) => {
  return 'hello world!'
})

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createId(): string {
  return yeast().split('').reverse().join('')
}

exports.addGame = runWith({
    enforceAppCheck: true
  })
  .https.onCall(async (data, context) => {
    if (context.app == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      )
    }
    if (context.auth == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      )
    }
    const id = createId()
    const newData = {
      name: id
    }
    console.log(`adding ${id}...`)
    await games.doc(id).set(newData)
    console.log('added!')
  })

exports.onCreateUser = auth.user().onCreate(async user =>{
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  console.log(`adding ${user.uid}...`)
  await users.doc(user.uid).set(newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

exports.onDeleteUser = auth.user().onDelete(async user =>{
  console.log(`deleting ${user.uid}...`)
  await users.doc(user.uid).delete()
  console.log(`${user.uid} deleted!`)
})

