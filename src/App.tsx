import { initializeApp } from 'firebase/app'
import { firebaseConfig, debugToken, reCaptchaSiteKey } from './secret'
import {
  collection, getFirestore, DocumentData, QueryDocumentSnapshot,
  SnapshotOptions, WithFieldValue, connectFirestoreEmulator
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' || // [::1] is the IPv6 localhost address.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) // 127.0.0.1/8 is considered localhost for IPv4.
)

const app = initializeApp(firebaseConfig)
// @ts-expect-error
if (isLocalhost) window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
  isTokenAutoRefreshEnabled: true
})
const db = getFirestore(app)
const auth = getAuth()
const functions = getFunctions(app)
connectFirestoreEmulator(db, 'localhost', 8080)
connectAuthEmulator(auth, 'http://localhost:9099')
connectFunctionsEmulator(functions, 'localhost', 5001)

interface Game {
  name: string
  id?: string
}

const converter = {
  toFirestore: (game: WithFieldValue<Game>): DocumentData => {
    return { name: game.name }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    return { id: snapshot.id, name: data.name }
  }
}

const games = collection(db, 'games')
const converted = games.withConverter(converter)

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

export default function App (): JSX.Element {
  const [user, userLoading, userError] = useAuthState(auth)
  const [games, gamesLoading, gamesError] = useCollectionData(converted)
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  console.log('user', user)
  const authView = (user != null) ? <button onClick={signOut}>Sign Out</button> : <button onClick={createAccount}>New Account</button>
  const gameViews = games?.map((value) => <p key={value.id}>{value.name}</p>)
  return (
    <>
      {authView}
      <button onClick={callAddGame}>Add Game</button>
      {gameViews}
    </>
  )
}
