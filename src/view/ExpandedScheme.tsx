import { Box, Card, CardBody, Stack, HStack, Circle, Heading, Flex, Spacer, Text } from '@chakra-ui/react'
import getBg from '../service/getBg'
import schemes from '../schemes.json'

export default function ExpandedSchemeView ({
  children,
  isDragging,
  rank
}: {
  children?: React.ReactNode
  isDragging?: boolean
  rank?: number
}
): JSX.Element {
  if (rank == null) {
    return <Text>Empty</Text>
  }
  const scheme = schemes[rank]
  if (scheme == null) {
    const message = `Scheme not found: ${rank}`
    throw new Error(message)
  }
  const cardBg = getBg({ rank, weight: 700 })
  const time = Array.from({ length: scheme.time }, (_, index) => <Heading color='white' key={index} size='md'>X</Heading>)
  const circleBg = getBg({ rank: scheme.rank, weight: 900 })
  const threat = scheme.threat !== '' && <Box color={circleBg} padding='10px' bg='white' height='112px'>{scheme.threat}</Box>
  const expandedHeight = children == null ? '370px' : '385px'
  return (
    <Card
      bg={cardBg}
      w='222px'
      height={expandedHeight}
    >
      <CardBody padding='10px'>
        <Stack height='100%'>
          <HStack>
            <Circle size='35px' bg={circleBg} color='white'>
              <Heading size='md'>
                {scheme.rank}
              </Heading>
            </Circle>
            {time}
          </HStack>
          <Heading size='sm'>{scheme.title}</Heading>
          <Flex direction='column' height='100%' gap='10px'>
            <Text minHeight='72px'>{scheme.beginning}</Text>
            <Text>{scheme.end}</Text>
            <Flex direction='column' height='100%'>
              <Spacer />
              {threat}
            </Flex>
          </Flex>
          {children}
        </Stack>
      </CardBody>
    </Card>
  )
}
