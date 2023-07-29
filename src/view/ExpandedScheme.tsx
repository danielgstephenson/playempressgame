import { Box, Stack, HStack, Circle, Heading, Flex, Spacer, Text } from '@chakra-ui/react'
import getBg from '../service/getBg'
import schemes from '../schemes.json'
import { RepeatClockIcon } from '@chakra-ui/icons'
import LargeSchemeView from './LargeScheme'
import ExpandedLinkView from './ExpandedLink'

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
  const threat = scheme.threat !== '' && <Box color={circleBg} padding='10px' bg='white' height='100%' maxHeight='112px'>{scheme.threat}</Box>
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
        <Heading size='xl' minH='85px'>{scheme.title}</Heading>
        <Flex direction='column' height='100%' gap='10px'>
          <Text minHeight='60px'>{scheme.beginning}</Text>
          <Text>{scheme.end}</Text>
          <Flex direction='column' height='100%' gap='10px'>
            <Spacer />
            {threat}
            <HStack spacing='10px'>
              <ExpandedLinkView label={scheme.label1} link={scheme.link1} icon={scheme.icon1} {...linkProps} />
              <ExpandedLinkView label={scheme.label2} link={scheme.link2} icon={scheme.icon2} {...linkProps} />
            </HStack>
          </Flex>
        </Flex>
      </Stack>
    </LargeSchemeView>
  )
}
