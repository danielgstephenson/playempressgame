import { StarIcon } from '@chakra-ui/icons'
import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import getTimelineRange from '../service/getTimelineRange'
import PopoverButtonView from './PopoverButton'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function TimelineView (): JSX.Element {
  const playState = useContext(playContext)
  const { timeline, dungeon, phase, final } = useContext(gameContext)
  if (timeline == null || phase == null || final == null) return <></>
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
  const { minimum, maximum } = getTimelineRange({ timelineLength: timeline.length, phase, final })
  const maximumLabel = maximum !== minimum && `-${maximum}`
  const finalIcon = final && <StarIcon />
  const label = <HStack alignItems='baseline'><Text>{minimum}{maximumLabel}</Text> {finalIcon}</HStack>
  return (
    <Stack alignSelf='start' spacing='3px'>
      <Heading size='sm'>
        <HStack alignItems='center'>
          <Text>Timeline</Text>
          <PopoverButtonView size='xs' label={label}>
            This is the final auction.
          </PopoverButtonView>
        </HStack>
      </Heading>
      <SchemesContainerView>
        {firstView}
        {views}
      </SchemesContainerView>
    </Stack>
  )
}
