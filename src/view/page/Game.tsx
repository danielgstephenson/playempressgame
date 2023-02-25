import { Heading } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import JoinGameView from '../JoinGame'
import GameViewer from '../GameViewer'

export default function GamePageView (): JSX.Element {
  const params = useParams()
  if (params.gameId == null) return <></>
  const joinGameView = <JoinGameView gameId={params.gameId} />
  return (
    <>
      <Heading>Game {params.gameId} {joinGameView}</Heading>
      <GameViewer gameId={params.gameId} />
    </>
  )
}
