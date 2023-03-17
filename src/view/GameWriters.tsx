import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Writer from './Writer'

export default function GameWriters (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.id == null) return <></>
  return (
    <>
      <Writer
        fn='joinGame'
        label='Join Game'
        props={{ gameId: gameState.id }}
      />
      {' '}
      <Writer
        fn='startGame'
        label='Start Game'
        props={{ gameId: gameState.id }}
        onCall={async (cloudFunction, props) => {
          console.log('before')
          await cloudFunction(props)
          console.log('after')
        }}
      />
    </>
  )
}
