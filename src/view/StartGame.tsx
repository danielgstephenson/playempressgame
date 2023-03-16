import Writer from './Writer'

export default function StartGameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Writer
      fn='startGame'
      label='Start Game'
      props={{ gameId }}
      onCall={async (cloudFunction, props) => {
        console.log('before')
        await cloudFunction(props)
        console.log('after')
      }}
    />
  )
}
