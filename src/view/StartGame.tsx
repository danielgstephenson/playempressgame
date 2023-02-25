import CallerView from './Caller'

export default function StartGameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <CallerView
      action='startGame'
      label='Start Game'
      onCall={async (callStartGame) => {
        void callStartGame({ gameId })
      }}
    />
  )
}
