import { StarIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import PopoverIconButtonView from './PopoverIconButton'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function TimelineView (): JSX.Element {
  const playState = useContext(playContext)
  const { timeline, dungeon, phase } = useContext(gameContext)
  if (timeline == null) return <></>
  const [first, ...rest] = timeline
  const firstView = first != null && (
    <TinyExpandableSchemeView
      rank={first.rank}
      mr='4px'
      {...getInCourtStyles({
        deck: playState.deck,
        dungeon,
        phase,
        rank: first.rank,
        tableau: playState.tableau
      })}
    />
  )
  const views = rest.map(scheme =>
    <TinyExpandableSchemeView rank={scheme.rank} key={scheme.id} />
  )
  return (
    <Box alignSelf='start'>
      <Heading size='sm'>
        <HStack alignItems='center'>
          <Text>Timeline</Text>
          <PopoverIconButtonView icon={<></>} size='xs' aria-label='Timeline' visibility='visible' minW='1px' maxW='1px' p='0'>
            This is the final auction.
          </PopoverIconButtonView>
        </HStack>
      </Heading>
      <SchemesContainerView>
        {firstView}
        {views}
      </SchemesContainerView>
    </Box>
  )
}
