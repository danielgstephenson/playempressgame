import { initializeApp } from 'firebase/app'
import { firebaseConfig, debugToken, reCaptchaSiteKey } from './secret'
import {
  collection, getFirestore, DocumentData, QueryDocumentSnapshot,
  SnapshotOptions, WithFieldValue, connectFirestoreEmulator, query, where
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { Button, Heading, Text } from '@chakra-ui/react'

import Users from './Users'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' || // [::1] is the IPv6 localhost address.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) // 127.0.0.1/8 is considered localhost for IPv4.
)

const app = initializeApp(firebaseConfig)
// @ts-expect-error
if (isLocalhost) window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
  isTokenAutoRefreshEnabled: true
})

interface Game {
  name: string
  id?: string
}

const gameConverter = {
  toFirestore: (game: WithFieldValue<Game>): DocumentData => {
    return { name: game.name }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    return { id: snapshot.id, name: data.name }
  }
}

const db = getFirestore(app)
if (isLocalhost) connectFirestoreEmulator(db, 'localhost', 8080)
const auth = getAuth()
if (isLocalhost) connectAuthEmulator(auth, 'http://localhost:9099')
const functions = getFunctions(app)
if (isLocalhost) connectFunctionsEmulator(functions, 'localhost', 5001)

export default function App (): JSX.Element {
  async function createAccount (): Promise<void> {
    try {
      await signInAnonymously(auth)
      console.log('signed in')
    } catch (error) {
      console.log(error)
    }
  }
  const addGame = httpsCallable(functions, 'addGame')
  async function callAddGame (): Promise<void> {
    console.log('calling addGame...')
    const result = await addGame()
    console.log('addGame called:', result)
  }
  const gamesCollection = collection(db, 'games')
  const gamesConverted = gamesCollection.withConverter(gameConverter)
  const gamesWhere = where('name', '!=', false)
  const gamesQuery = query(gamesConverted, gamesWhere)
  const [user, userLoading, userError] = useAuthState(auth)
  const [games, gamesLoading, gamesError] = useCollectionData(gamesQuery)
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  console.log('auth', auth)
  console.log('user', user)
  const authView = (user != null) ? <Button onClick={signOut}>Sign Out</Button> : <Button onClick={createAccount}>New Account</Button>
  const gameViews = games?.map((value) => <Text key={value.id}>{value.name}</Text>)
  console.log('gamesError', gamesError)
  console.log('games', games)
  const usersView = user != null && <Users db={db} />
  return (
    <>
      {authView}
      {usersView}
      <Heading>Games <Button onClick={callAddGame}>Add Game</Button></Heading>
      {gameViews}
    </>
  )
}
