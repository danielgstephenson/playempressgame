import { CardProps, forwardRef, Heading, HStack, Stack } from '@chakra-ui/react'
import SmallScheme from './SmallScheme'
import schemes from '../schemes.json'
import getBg from '../service/getBg'
import { ReactNode, Ref } from 'react'
import CircleView from './Circle'

function View ({
  active,
  children,
  rank,
  ...cardProps
}: {
  active?: boolean
  children?: ReactNode
  rank: number
} & CardProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  const scheme = schemes[rank]
  if (scheme == null) {
    return <>CollapsedScheme</>
  }
  const time = Array.from(
    { length: scheme.time },
    (_, index) => (
      <Heading key={index} color='white' size='sm' m='0'>X</Heading>
    )
  )
  const cardBg = getBg({ rank, weight: 700 })
  const circleBg = getBg({ rank: scheme.rank, weight: 900 })
  return (
    <SmallScheme
      active={active}
      bg={cardBg}
      ref={ref}
      {...cardProps}
    >
      <Stack height='100%' justifyContent='space-between'>
        <Stack spacing='5px'>
          <HStack color={circleBg} spacing='2px'>
            <CircleView bg={circleBg}>
              <Heading size='sm'>
                {scheme.rank}
              </Heading>
            </CircleView>
            {time}
          </HStack>
          <Heading size='xs' fontSize='xs'>{scheme.title}</Heading>
        </Stack>
        {children}
      </Stack>
    </SmallScheme>
  )
}

const CollapsedSchemeView = forwardRef(View)
export default CollapsedSchemeView
