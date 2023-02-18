import ChakraLinkView from './ChakraLink'
import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'

export default function HeaderView (): JSX.Element {
  return (
    <HStack spacing='20px'>
      <AuthView />
      <ChakraLinkView to='/'>Home</ChakraLinkView>
      <ChakraLinkView to='/games'>Games</ChakraLinkView>
    </HStack>
  )
}
