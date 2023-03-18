import Action from './Action'

export default function JoinGameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Action
      fn='joinGame'
      label='Join Game'
      props={{ gameId }}
    />
  )
}
