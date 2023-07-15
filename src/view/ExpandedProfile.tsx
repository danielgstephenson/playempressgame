import { Box, Heading, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import Curtain from './Curtain'
import ExpandedSchemeView from './ExpandedScheme'
import PublicTableauView from './PublicTableau'
import PublicTrashView from './PublicTrash'
import SmallSchemeView from './SmallScheme'
import Status from './Status'
import TinySchemesView from './TinySchemes'
import TrashHistoryView from './TrashHistory'

export default function ExpandedProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const deckFull = profileState.deckEmpty !== true
  const deck = profileState.deck == null
    ? (
      <Curtain open={deckFull}>
        <SmallSchemeView bg='gray.500' />
      </Curtain>
      )
    : <TinySchemesView schemes={profileState.deck} />
  const discard = profileState.discard == null
    ? <ExpandedSchemeView rank={profileState.topDiscardScheme?.rank} />
    : <TinySchemesView schemes={profileState.discard} />
  const hand = profileState.hand != null && (
    <><Heading size='sm'>Hand</Heading><TinySchemesView schemes={profileState.hand} /></>
  )
  const trash = profileState.privateTrashHistory == null
    ? <PublicTrashView />
    : (
      <>
        <Heading size='sm'>Trash</Heading>
        <TrashHistoryView history={profileState.privateTrashHistory} />
      </>
      )
  return (
    <HStack>
      <Box>
        <Heading size='md'>{profileState.displayName}</Heading>
        <Status label='Bid' value={profileState.bid} />
        <Status label='Gold' value={profileState.gold} />
        <Status label='Silver' value={profileState.silver} />
        <PublicTableauView />
        {hand}
        <Heading size='sm'>Deck</Heading>
        {deck}
        {trash}
      </Box>
      <Box>
        <Heading size='sm'>Discard</Heading>
        {discard}
      </Box>
    </HStack>
  )
}
