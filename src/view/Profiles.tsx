import { Alert, AlertIcon, Box, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import ProfileProvider from '../context/profile/Provider'
import { gameContext } from '../reader/game'
import ProfileView from './Profile'

export default function ProfilesView (): JSX.Element {
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  if (gameState.profiles == null) {
    return <></>
  }
  const copy = [...gameState.profiles]
  copy.sort((a, b) => a.userId === authState.currentUser?.uid ? 1 : -1)
  const items = copy.map((profile) => (
    <ProfileProvider key={profile.userId} profile={profile}>
      <ProfileView key={profile.userId} />
    </ProfileProvider>
  ))
  const heading = gameState.profiles.length === 1 && (
    <Alert status='warning'>
      <HStack m='0 auto' spacing='0' alignItems='end'>
        <AlertIcon />
        <Box>Waiting for more players</Box>
      </HStack>
    </Alert>
  )
  return (
    <>
      {heading}
      {items}
    </>
  )
}
