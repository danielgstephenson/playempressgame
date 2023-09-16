import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import Curtain from './Curtain'
import Clink from 'clink-react'
import { useParams } from 'react-router-dom'
import { gameContext } from '../reader/game'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function HeaderView (): JSX.Element {
  const params = useParams()
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const inGame = params.gameId != null
  const showPrivilege = gameState.phase != null && gameState.phase !== 'join'
  return (
    <HStack justifyContent='space-between'>
      <HStack spacing='20px'>
        <Clink to='/'>Home</Clink>
        <Curtain open={authState.authed}>
          <Clink to='/games'>Games</Clink>
        </Curtain>
        <Curtain open={inGame}>
          <Clink to={`/game/${String(params.gameId)}`} fontWeight='bold'>
            {params.gameId}
          </Clink>
          <Curtain open={showPrivilege}>
            <TinyExpandableSchemeView rank={1} />
          </Curtain>
        </Curtain>
      </HStack>
      <AuthView />
    </HStack>
  )
}
