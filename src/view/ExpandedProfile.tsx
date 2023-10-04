import { Heading, HStack, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import getScore from '../service/getScore'
import Curtain from './Curtain'
import ExpandedSchemeView from './ExpandedScheme'
import LargeSchemeView from './LargeScheme'
import PublicTrashView from './PublicTrash'
import TinySchemesView from './TinySchemes'
import TrashHistoryView from './TrashHistory'

export default function ExpandedProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  if (profileState.privateTrashHistory == null) {
    return <></>
  }
  const playEmpty = profileState.playScheme == null
  const gameOver = profileState.privateTrashHistory.length > 0
  const score = getScore(profileState)
  return (
    <Stack p='5px' spacing='5px'>
      <Heading size='md' textAlign='center'>{profileState.displayName}</Heading>
      <Curtain open={gameOver}>
        <Heading size='sm'>Final Score</Heading>
        <Heading size='lg'>{score}</Heading>
        <Heading size='sm'>Gold</Heading>
        <Heading size='lg'>{profileState.gold}</Heading>
        <Heading size='sm'>Silver</Heading>
        <Heading size='lg'>{profileState.silver}</Heading>
        <Heading size='sm'>Hand</Heading>
        <TinySchemesView schemes={profileState.hand} />
        <Heading size='sm'>Reserve</Heading>
        <HStack>
          <TinySchemesView schemes={profileState.reserve} />
          <TinySchemesView schemes={profileState.reserve} />
        </HStack>
      </Curtain>
      <Heading size='sm'>Last Played</Heading>
      <Curtain open={playEmpty} hider={<ExpandedSchemeView rank={profileState.playScheme?.rank} />}>
        <LargeSchemeView border='2px dashed gray' />
      </Curtain>
      <Heading size='sm'>Trash</Heading>
      <Curtain open={gameOver} hider={<PublicTrashView />}>
        <TrashHistoryView history={profileState.privateTrashHistory} />
      </Curtain>
      <Curtain open={gameOver} />
    </Stack>
  )
}
