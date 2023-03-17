import Writer from '.'

export default function JoinGameWriter ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Writer
      fn='joinGame'
      label='Join Game'
      props={{ gameId }}
    />
  )
}
