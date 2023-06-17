import { Box, CardBody, Circle, Flex, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import schemes from '../schemes.json'
import getBg from '../service/getBg'

export default function SchemeContentView ({
  children,
  rank
}: {
  children?: ReactNode
  rank: number
}): JSX.Element {
  const scheme = schemes[rank]
  if (scheme == null) {
    return <></>
  }
  const threat = scheme.threat !== '' && <Box padding='10px' bg='white' height='112px'>{scheme.threat}</Box>
  const time = Array.from({ length: scheme.time }, (_, index) => <Heading key={index} size='lg'>X</Heading>)
  const bg = getBg({ rank: scheme.rank, weight: 900 })
  return (
    <>
      <CardBody padding='10px'>
        <Stack height='100%'>
          <HStack color={bg}>
            <Circle size='35px' bg={bg} color='white'>
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
    </>
  )
}
