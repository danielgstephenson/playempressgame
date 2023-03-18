import ChakraLinkView from './ChakraLink'
import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import Curtain from './Curtain'

export default function HeaderView (): JSX.Element {
  const authState = useContext(authContext)
  return (
    <HStack spacing='20px'>
      <AuthView />
      <ChakraLinkView to='/'>Home</ChakraLinkView>
      <Curtain open={authState.authed}>
        <ChakraLinkView to='/games'>Games</ChakraLinkView>
      </Curtain>
    </HStack>
  )
}
