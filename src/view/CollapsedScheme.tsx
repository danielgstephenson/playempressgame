import { CardProps, forwardRef, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import SmallScheme from './SmallScheme'
import schemes from '../schemes.json'
import getBg from '../service/getBg'
import { Ref } from 'react'
import CircleView from './Circle'
import { RepeatClockIcon } from '@chakra-ui/icons'
import CollapsedLinkView from './CollapsedLink'
import SchemeIconView from './SchemeIcon'

function View ({
  active,
  rank,
  ...cardProps
}: {
  active?: boolean
  rank: number
} & CardProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  const scheme = schemes[rank]
  if (scheme == null) {
    return <>CollapsedScheme</>
  }
  const time = Array.from({ length: 3 }, (_, index) => {
    if (index < scheme.time) {
      return (
        <Text fontSize='10px' key={index} color='white'><RepeatClockIcon /></Text>
      )
    }
    return (
      <Spacer key={index} maxW='10px' />
    )
  })
  const cardBg = getBg({ rank, weight: 700 })
  const circleBg = getBg({ rank: scheme.rank, weight: 900 })
  return (
    <SmallScheme
      active={active}
      bg={cardBg}
      ref={ref}
      {...cardProps}
    >
      <Stack height='100%' justifyContent='space-between' spacing='0'>
        <Stack spacing='5px'>
          <HStack color={circleBg} spacing='2px' justifyContent='space-between' width='100%' alignItems='start'>
            <CircleView bg={circleBg}>
              <Heading size='xs'>
                {scheme.rank}
              </Heading>
            </CircleView>
            {time}
          </HStack>
          <Heading size='xs' fontSize='9.4px' h='30px'>
            {scheme.title}
          </Heading>
          <Heading size='lg' textAlign='center'>
            <SchemeIconView rank={rank} />
          </Heading>
        </Stack>
        <HStack>
          <CollapsedLinkView link={scheme.link1} icon={scheme.icon1} />
          <CollapsedLinkView link={scheme.link2} icon={scheme.icon2} />
        </HStack>
      </Stack>
    </SmallScheme>
  )
}

const CollapsedSchemeView = forwardRef(View)
export default CollapsedSchemeView
