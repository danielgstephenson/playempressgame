import { Button } from '@chakra-ui/react'
import { Functions, httpsCallable } from 'firebase/functions'

export default function AddGameView ({
  functions
}: {
  functions: Functions
}): JSX.Element {
  const addGame = httpsCallable(functions, 'addGame')
  async function callAddGame (): Promise<void> {
    console.log('calling addGame...')
    const result = await addGame()
    console.log('addGame called:', result)
  }
  return <Button onClick={callAddGame}>Add Game</Button>
}
