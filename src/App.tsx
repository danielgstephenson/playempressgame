import { useState } from "react"
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "./secret"
import { collection, getFirestore, DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore"
import { useCollectionData } from 'react-firebase-hooks/firestore';

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Game { 
  name: string
  id?: string
}

const converter = {
  toFirestore: (game: WithFieldValue<Game>): DocumentData => {
    return {name: game.name}
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    return { id: snapshot.id, name: data.name }
  }
}

const games = collection(db,'games')
const converted = games.withConverter(converter)

export default function App (): JSX.Element {
  const [count, setCount] = useState(0)
  const [values, loading, error] = useCollectionData (converted);
  console.log('values', values)
  console.log('loading', loading)
  console.log('error', error)
  console.log('count render', count)
  function handleCount (): void {
    console.log('click')
    console.log('count before', count)
    setCount((oldCount) => oldCount + 1)
    console.log('count after', count)
  }
  const games = values?.map((value) => <p key={value.id}>{value.name}</p>)
  return (
    <>
      <h1 onClick={handleCount}>{count}</h1>

      <p>World</p>
      {games}
    </>
  )
}
