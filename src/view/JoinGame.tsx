import Writer from './Writer'

export default function JoinGameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Writer
      fn='joinGame'
      label='Join Game'
      props={{ gameId }}
    />
  )
}
