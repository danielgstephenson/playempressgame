// import * as admin from "firebase-admin";
import admin from 'firebase-admin';
import { https, runWith } from "firebase-functions"
import { firebaseConfig } from './secret'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

admin.initializeApp(firebaseConfig);
const db = admin.firestore()
const games = db.collection('games')

exports.hello = runWith({
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