import { Box, Stack, HStack, Circle, Heading, Flex, Text } from '@chakra-ui/react'
import getBg from '../service/getBg'
import schemes from '../schemes.json'
import { RepeatClockIcon } from '@chakra-ui/icons'
import LargeSchemeView from './LargeScheme'
import ExpandedLinkView from './ExpandedLink'
import SchemeIconView from './SchemeIcon'

export default function ExpandedSchemeView ({
  rank
}: {
  rank?: number
}): JSX.Element {
  if (rank == null) {
    return <Text>Empty</Text>
  }
  const scheme = schemes[rank]
  if (scheme == null) {
    const message = `Scheme not found: ${rank}`
    throw new Error(message)
  }
  const cardBg = getBg({ rank, weight: 700 })
  const time = Array.from({ length: 3 }, (_, index) => {
    if (index < scheme.time) {
      return (
        <Heading color='white' key={index} size='xl' display='flex'>
          <RepeatClockIcon />
        </Heading>
      )
    }
    return (
      <Box key={index} w='30px' />
    )
  })
  const circleBg = getBg({ rank: scheme.rank, weight: 900 })
  const threatProps = scheme.threat !== '' ? { color: circleBg, padding: '11px', bg: 'white' } : {}
  const threat = <Box {...threatProps} maxH='114px'>{scheme.threat}</Box>
  const linkProps = scheme.rank === 25 ? { fontSize: '10px' } : {}
  return (
    <LargeSchemeView bg={cardBg}>
      <Stack height='100%'>
        <HStack alignItems='center' justifyContent='space-between' width='100%'>
          <Circle size='50px' bg={circleBg} color='white'>
            <Heading size='xl'>
              {scheme.rank}
            </Heading>
          </Circle>
          {time}
        </HStack>
        <Box>
          <Heading size='xl' minH='65px' mb='10px'>
            {scheme.title}
          </Heading>
          <Heading size='xl' textAlign='center' mb='10px'>
            <SchemeIconView rank={rank} />
          </Heading>
        </Box>
        <Flex direction='column' height='100%' gap='10px' justifyContent='space-between'>
          <Text minHeight='60px'>{scheme.beginning}</Text>
          <Text>{scheme.end}</Text>
          {threat}
          <HStack spacing='10px'>
            <ExpandedLinkView label={scheme.label1} link={scheme.link1} icon={scheme.icon1} {...linkProps} />
            <ExpandedLinkView label={scheme.label2} link={scheme.link2} icon={scheme.icon2} {...linkProps} />
          </HStack>
        </Flex>
      </Stack>
    </LargeSchemeView>
  )
}
