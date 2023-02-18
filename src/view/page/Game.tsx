import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import authContext from '../../context/auth'
import functionsContext from '../../context/functions'
import GameContentView from '../GameContent'
import JoinGameView from '../JoinGame'
import dbContext from '../../context/db'

export default function GamePageView (): JSX.Element {
  const params = useParams()
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  const dbState = useContext(dbContext)
  if (params.gameId == null) return <></>
  const joinGameView = functionsState.functions != null && <JoinGameView functions={functionsState.functions} gameId={params.gameId} />
  const content = dbState.db != null && <GameContentView db={dbState.db} gameId={params.gameId} />
  return (
    <>
      <Heading>Game {params.gameId} {joinGameView}</Heading>
      {content}
    </>
  )
}
