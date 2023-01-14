import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './secret'
import {
  collection, getFirestore, DocumentData, QueryDocumentSnapshot,
  SnapshotOptions, WithFieldValue, connectFirestoreEmulator
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()

connectFirestoreEmulator(db, 'localhost', 8080)

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

export default function App (): JSX.Element {
  const [user, userLoading, userError] = useAuthState(auth)
  const [games, gamesLoading, gamesError] = useCollectionData(converted)
  console.log('user', user)
  const gameViews = games?.map((value) => <p key={value.id}>{value.name}</p>)
  return (
    <>
      <button onClick={createAccount}>New Account</button>
      {gameViews}
    </>
  )
}
