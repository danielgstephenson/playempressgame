import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import profileContext from '../context/profile'

export default function ProfileHeadingView (): JSX.Element {
  const authState = useContext(authContext)
  const profileState = useContext(profileContext)
  const currentPlayer = authState.currentUser?.uid === profileState.userId
  const size = currentPlayer ? 'md' : 'sm'
  return <Heading size={size} textAlign='center'>{profileState.displayName}</Heading>
}
