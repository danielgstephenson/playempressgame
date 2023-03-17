import Writer from '.'

export default function StartGameWriter ({ gameId }: { gameId: string }): JSX.Element {
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
