import { Alert, CardBody, Heading, Highlight, HStack, Stack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import schemes from '../schemes.json'

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
  const threat = scheme.threat !== '' && <Alert bg='white'>{scheme.threat}</Alert>
  const rankString = String(scheme.rank)
  return (
    <>
      <CardBody>
        <Stack>
          <HStack>
            <Heading size='md'>
              <Highlight query={rankString} styles={{ px: '1', py: '1', bg: 'black', color: 'white' }}>{rankString}</Highlight>
              {' '}
              {scheme.title}
            </Heading>
          </HStack>
          <Text>{scheme.beginning}</Text>
          <Text>{scheme.end}</Text>
          {threat}
          {children}
        </Stack>
      </CardBody>
    </>
  )
}
