import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { Functions } from 'firebase/functions'
import ActionView from './Action'

export default function JoinGameView ({
  functions,
  gameId
}: {
  functions: Functions
  gameId: string
}): JSX.Element {
  const [callJoinGame, joinGameLoading, joinGameError] = useHttpsCallable(functions, 'joinGame')
  async function joinGame (): Promise<void> {
    await callJoinGame({ gameId })
  }
  return <ActionView label='Join Game' action={joinGame} loading={joinGameLoading} error={joinGameError} />
}
