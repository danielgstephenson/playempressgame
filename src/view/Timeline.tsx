import { StarIcon } from '@chakra-ui/icons'
import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import getInTimelineStyles from '../service/getInTimelineStyles'
import getTimelineRange from '../service/getTimelineRange'
import PopoverButtonView from './PopoverButton'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function TimelineView (): JSX.Element {
  const playState = useContext(playContext)
  const { timeline, dungeon, phase, final, choices, profiles } = useContext(gameContext)
  const profileState = useContext(profileContext)
  if (timeline == null || phase == null || final == null || choices == null || profiles == null || profileState.userId == null) return <></>
  const [first, ...rest] = timeline
  const firstView = first != null && (
    <TinyExpandableSchemeView
      rank={first.rank}
      mr='4px'
      {...getInTimelineStyles({
        choices,
        deck: playState.deck,
        dungeon,
        phase,
        profiles,
        rank: first.rank,
        tableau: playState.tableau,
        userId: profileState.userId
      })}
    />
  )
  const views = rest.map(scheme =>
    <TinyExpandableSchemeView rank={scheme.rank} key={scheme.id} />
  )
  const { minimum, maximum } = getTimelineRange({ timelineLength: timeline.length, phase, final, choices })
  const range = maximum !== minimum
  const maximumLabel = range && `-${maximum}`
  const finalIcon = final && <StarIcon />
  const label = <HStack alignItems='baseline'><Text>{minimum}{maximumLabel}</Text> {finalIcon}</HStack>
  const minimumPlays = minimum === 1 ? 'play' : 'plays'
  const maximumPlays = maximum === 1 ? 'play' : 'plays'
  const timelineRangeDetails = range
    ? (
      <>
        <Text>There will be at least {minimum} {minimumPlays} after this.</Text>
        <Text>There will be at most {maximum} {maximumPlays} after this.</Text>
      </>
      )
    : minimum === 0
      ? profiles.every(profile => profile.playReady)
        ? <Text>The game is over.</Text>
        : <Text>This is the final play.</Text>
      : <Text>There will be {minimum} {minimumPlays} after this.</Text>

  return (
    <Stack alignSelf='start' spacing='3px'>
      <Heading size='sm'>
        <HStack alignItems='center'>
          <Text>Timeline</Text>
          <PopoverButtonView size='xs' label={label}>
            {timelineRangeDetails}
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
