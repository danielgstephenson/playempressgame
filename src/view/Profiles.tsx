import { Alert, AlertIcon, Box, HStack, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import ProfileProvider from '../context/profile/Provider'
import { gameContext } from '../reader/game'
import useCurrentPlaying from '../use/currentPlaying'
import useGamePlaying from '../use/gamePlaying'
import PlayerProfileView from './PlayerProfile'

export default function ProfilesView (): JSX.Element {
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  const gamePlaying = useGamePlaying()
  const currentPlaying = useCurrentPlaying()
  if (gameState.profiles == null || gameState.phase == null) {
    return <></>
  }
  const copy = [...gameState.profiles]
  copy.sort((a, b) => a.userId === authState.currentUser?.uid ? 1 : -1)
  const items = copy.map((profile) => (
    <ProfileProvider key={profile.userId} profile={profile}>
      <PlayerProfileView key={profile.userId} />
    </ProfileProvider>
  ))
  const warning = gameState.profiles.length === 1 && (
    <Alert status='warning'>
      <HStack m='0 auto' spacing='0' alignItems='end'>
        <AlertIcon />
        <Box>Waiting for more players</Box>
      </HStack>
    </Alert>
  )
  const observingPlay = gamePlaying && !currentPlaying
  const profileItems = observingPlay
    ? (
      <Stack direction='row' justifyContent='center'>
        {items}
      </Stack>
      )
    : items
  return (
    <>
      {warning}
      {profileItems}
    </>
  )
}
