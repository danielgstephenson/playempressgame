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
db.settings({ ignoreUndefinedProperties: true })
const gamesRef = db.collection('games')
const usersRef = db.collection('users')
const profilesRef = db.collection('profiles')
const green = [0, 1, 2, 3, 4, 5, 6, 23, 24, 25]
const red = [8, 9, 10, 11, 12, 13, 14, 15]
const yellow = [16, 17, 18, 19, 20, 21, 22]

exports.hello = https.onCall((data, context) => {
  return 'hello world!'
})

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createId(): string {
  return yeast().split('').reverse().join('')
}

function createRange(length: number): number[] {
  return Array.from(Array(length).keys())
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
      userIds: [],
      court: [],
      dungeon: [],
      timeline: []
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
    if (!userDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user does not exist.'
      )
    }
    const userData = userDoc.data()
    if (!userData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user is empty.'
      )
    }
    const gameRef = gamesRef.doc(data.gameId)
    const gameDoc = await gameRef.get()
    if (!gameDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game does not exist.'
      )
    }
    const gameData = gameDoc.data()
    if (gameData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game is empty.'
      )
    }
    if (gameData.userIds.includes(context.auth.uid)) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user has already joined the game.'
      )
    }
    if (gameData.phase !== 'join') {
      throw new https.HttpsError(
        'failed-precondition',
        'This game has already started.'
      )
    }
    console.log(`joining game...`)
    await profilesRef.add({ userId: context.auth.uid, gameId: data.gameId })
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
    if (!userDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user does not exist.'
      )
    }
    const userData = userDoc.data()
    if (!userData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user is empty.'
      )
    }
    const gameRef = gamesRef.doc(data.gameId)
    const gameDoc = await gameRef.get()
    if (!gameDoc.exists) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game does not exist.'
      )
    }
    const gameData = gameDoc.data()
    if (gameData == null) {
      throw new https.HttpsError(
        'failed-precondition',
        'This game is empty.'
      )
    }
    if (!gameData.userIds.includes(context.auth.uid)) {
      throw new https.HttpsError(
        'failed-precondition',
        'This user has not joined the game.'
      )
    }
    if (gameData.phase !== 'join') {
      throw new https.HttpsError(
        'failed-precondition',
        'This game has already started.'
      )
    }
    console.log(`starting game...`)
    const range = createRange(26) // [0..25]
    console.log('range test:', range)
    const separated = [1, 7]
    const rangeSeparated = range.filter(rank => !separated.includes(rank))
    const randomRange = range.map(() => Math.random())
    const shuffled = [...rangeSeparated].sort((aRank, bRank) => {
      const randomA = randomRange[aRank]
      const randomB = randomRange[bRank]
      return randomA - randomB
    })
    console.log('shuffled test:', shuffled)
    const empressSize = 13 + gameData.userIds.length
    console.log('empressSize test:', empressSize)
    const empressSlice = shuffled.slice(0, empressSize)
    console.log('empressSlice test:', empressSlice)
    const sorted = [...empressSlice].sort((aRank, bRank) => {
      return aRank - bRank
    })
    console.log('sorted test:', sorted)
    const court = sorted[0]
    const dungeon = sorted[1]
    const palaceSlice = sorted.slice(2)
    console.log('palaceSlice test:', palaceSlice)
    const empressGreen = palaceSlice.filter(rank => green.includes(rank))
    const empressRed = palaceSlice.filter(rank => red.includes(rank))
    const empressYellow = palaceSlice.filter(rank => yellow.includes(rank))
    const lowestYellow = empressYellow[0]
    const lowGreen = empressGreen.slice(0, 2)
    const lowRed = empressRed.slice(0, 2)
    const basePortfolio = [7, lowestYellow, ...lowGreen, ...lowRed]
    console.log('baseHand test:', basePortfolio)
    const empressLeft = palaceSlice.filter(rank => !basePortfolio.includes(rank))
    console.log('empressLeft test:', empressLeft)
    const lowestLeft = empressLeft[0]
    const portfolio = [...basePortfolio, lowestLeft]
    console.log('portfolio test:', portfolio)
    const timeline = empressLeft.slice(1)
    console.log('timeline test:', timeline)
    await gameRef.update({
      phase: 'play',
      court: [court],
      dungeon: [dungeon],
      timeline
    })
    console.log('started!')
  })

exports.onCreateUser = auth.user().onCreate(async user => {
  const displayName = createId()
  const newData = { uid: user.uid, displayName }
  console.log(`adding ${user.uid}...`)
  await usersRef.doc(user.uid).set(newData)
  await adminAuth.updateUser(user.uid, { displayName })
  console.log(`${user.uid} added!`)
})

exports.onDeleteUser = auth.user().onDelete(async user => {
  console.log(`deleting ${user.uid}...`)
  await usersRef.doc(user.uid).delete()
  console.log(`${user.uid} deleted!`)
})

