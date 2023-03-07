import { Text } from '@chakra-ui/react'
import { profileContext } from '../context/firestream/profile'
import PlayerStreamer from '../context/firestream/player'
import { useContext } from 'react'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <>
      <Text>Profile: {profileState.userId}</Text>
      <PlayerStreamer />
    </>
  )
}
