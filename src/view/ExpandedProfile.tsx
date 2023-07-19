import { Heading, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
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
  return (
    <Stack p='5px' spacing='5px'>
      <Heading size='md' textAlign='center'>{profileState.displayName}</Heading>
      <Heading size='sm'>Last Played</Heading>
      <Curtain open={playEmpty} hider={<ExpandedSchemeView rank={profileState.playScheme?.rank} />}>
        <LargeSchemeView border='2px dashed gray' />
      </Curtain>
      <Heading size='sm'>Trash</Heading>
      <Curtain open={gameOver} hider={<PublicTrashView />}>
        <TrashHistoryView history={profileState.privateTrashHistory} />
      </Curtain>
      <Curtain open={gameOver}>
        <Heading size='sm'>Hand</Heading>
        <TinySchemesView schemes={profileState.hand} />
      </Curtain>
      <Curtain open={gameOver}>
        <Heading size='sm'>Deck</Heading>
        <TinySchemesView schemes={profileState.deck} />
      </Curtain>
      <Curtain open={gameOver}>
        <Heading size='sm'>Discard</Heading>
        <TinySchemesView schemes={profileState.discard} />
      </Curtain>
    </Stack>
  )
}
