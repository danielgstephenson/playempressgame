import ChakraLinkView from './ChakraLink'
import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'

export default function HeaderView (): JSX.Element {
  const authState = useContext(authContext)
  const gameLinkView = authState.authed === true && <ChakraLinkView to='/games'>Games</ChakraLinkView>
  return (
    <HStack spacing='20px'>
      <AuthView />
      <ChakraLinkView to='/'>Home</ChakraLinkView>
      {gameLinkView}
    </HStack>
  )
}
