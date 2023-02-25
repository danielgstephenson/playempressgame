import CallerView from './Caller'

export default function JoinGameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <CallerView
      action='joinGame'
      label='Join Game'
      onCall={async (callJoinGame) => {
        void callJoinGame({ gameId })
      }}
    />
  )
}
