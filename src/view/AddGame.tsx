import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { Functions } from 'firebase/functions'
import ActionView from './Action'

export default function AddGameView ({
  functions
}: {
  functions: Functions
}): JSX.Element {
  const [callAddGame, addGameLoading, addGameError] = useHttpsCallable(functions, 'addGame')
  async function addGame (): Promise<void> {
    await callAddGame()
  }
  return <ActionView label='Add Game' action={addGame} loading={addGameLoading} error={addGameError} />
}
