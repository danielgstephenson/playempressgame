// import * as admin from "firebase-admin";
import admin from 'firebase-admin';
import { https, runWith, auth } from "firebase-functions"
import { firebaseConfig } from './secret'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

admin.initializeApp(firebaseConfig);
const db = admin.firestore()
const games = db.collection('games')
const users = db.collection('users')

exports.hello = https.onCall((data, context) => {
  return 'hello world!'
})
/*
runWith({
    enforceAppCheck: true
  })
  .https.onCall((data, context) => {
    if (context.app == undefined) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      )
    }
    return 'hello world!'
  })
*/


exports.addGame = runWith({
    enforceAppCheck: true
  })
  .https.onCall(async (data, context) => {
    if (context.app == undefined) {
      throw new https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      )
    }
    const now = Date.now()
    const newData = {
      name: now
    }
    console.log(`adding ${now}...`)
    await games.add(newData)
    console.log('added!')
  })

exports.onCreateUser = auth.user().onCreate(async user =>{
  const newData = { uid: user.uid }
  console.log(`adding ${user.uid}...`)
  await users.doc(user.uid).set(newData)
  console.log(`${user.uid} added!`)
})

exports.onDeleteUser = auth.user().onDelete(async user =>{
  console.log(`deleting ${user.uid}...`)
  await users.doc(user.uid).delete()
  console.log(`${user.uid} deleted!`)
})