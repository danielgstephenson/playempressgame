// import * as admin from "firebase-admin";
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { https, runWith, auth } from "firebase-functions"
import { firebaseConfig } from './secret'
import yeast from 'yeast'
import firebase from 'firebase/app'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

admin.initializeApp(firebaseConfig);
const adminAuth = getAuth()
const db = admin.firestore()
db.settings({ignoreUndefinedProperties: true})
const gamesRef = db.collection('games')
const usersRef = db.collection('users')
const profilesRef = db.collection('profiles')

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
      name: id,
      phase: 'join',
      userIds: []
    }
    const gameRef = gamesRef.doc(id)
    console.log(`adding ${id}...`)
    await gameRef.set(newData)
    console.log('added!')
  })

exports.joinGame = runWith({
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
    const userRef = usersRef.doc(context.auth.uid)
    const userDoc = await userRef.get()
    if(!userDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user does not exist.'
      )
    }
    const userData = userDoc.data()
    if(!userData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user is empty.'
      )
    }
    const gameRef = gamesRef.doc(data.gameId)
    const gameDoc = await gameRef.get()
    if(!gameDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game does not exist.'
      )
    }
    const gameData = gameDoc.data()
    if(gameData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game is empty.'
      )
    }
    if(gameData.userIds.includes(context.auth.uid)) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user has already joined the game.'
      )
    }
    if(gameData.phase !== 'join') {
      throw new https.HttpsError(
        'failed-precondition',
        'This game has already started.'
      )
    }
    console.log(`joining game...`)
    await profilesRef.add({ userId: context.auth.uid, gameId: data.gameId})
    await gameRef.update({
      userIds: admin.firestore.FieldValue.arrayUnion(context.auth.uid)
    })
    console.log('joined!')
  })

exports.startGame = runWith({
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
    const userRef = usersRef.doc(context.auth.uid)
    const userDoc = await userRef.get()
    if(!userDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user does not exist.'
      )
    }
    const userData = userDoc.data()
    if(!userData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user is empty.'
      )
    }
    const gameRef = gamesRef.doc(data.gameId)
    const gameDoc = await gameRef.get()
    if(!gameDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game does not exist.'
      )
    }
    const gameData = gameDoc.data()
    if(gameData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game is empty.'
      )
    }
    if(!gameData.userIds.includes(context.auth.uid)) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user has not joined the game.'
      )
    }
    if(gameData.phase !== 'join') {
      throw new https.HttpsError(
        'failed-precondition',
        'This game has already started.'
      )
    }
    console.log(`starting game...`)
    await gameRef.update({
      phase: 'play'
    })
    console.log('started!')
  })

exports.onCreateUser = auth.user().onCreate(async user =>{
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  console.log(`adding ${user.uid}...`)
  await usersRef.doc(user.uid).set(newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

exports.onDeleteUser = auth.user().onDelete(async user =>{
  console.log(`deleting ${user.uid}...`)
  await usersRef.doc(user.uid).delete()
  console.log(`${user.uid} deleted!`)
})

