const {
  getFirestore,
  collection,
  getDocs,
  connectFirestoreEmulator,
  addDoc
} = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
const firebaseConfig = require('./secret.js')
const { getFunctions, httpsCallable, connectFunctionsEmulator } = require('firebase/functions')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080)

const functions = getFunctions(app)
connectFunctionsEmulator(functions, 'localhost', 5001)

const hello = httpsCallable(functions, 'hello')
async function callHello () {
  console.log('Calling hello...')
  const result = await hello()
  console.log('Called hello:', result)
}
callHello()

const addGame = httpsCallable(functions, 'addGame')
async function callAddGame () {
  console.log('Calling addGame...')
  const result = await addGame()
  console.log('Called addGame:', result)
}
callAddGame()

const gamesRef = collection(db, 'games')

async function download () {
  const querySnapshot = await getDocs(gamesRef)
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data())
  })
}

// download()

async function upload () {
  await download()
  const data = {
    name: 'game2'
  }
  console.log('adding...')
  await addDoc(gamesRef, data)
  await download()
}

upload()
