import { HStack, Text, TextProps } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import LinkIconView from './LinkIcon'

export default function ExpandedLinkView ({
  icon,
  label,
  link,
  ...restProps
}: {
  icon: string
  label: string
  link: string
} & TextProps): JSX.Element {
  return (
    <Link to={link} target='_blank' onClick={(event) => event.stopPropagation()}>
      <HStack spacing='3px'>
        <LinkIconView src={icon} />
        {/* <LinkLabelView label={link} /> */}
        <Text fontSize='xs' {...restProps}>{label}</Text>
      </HStack>
    </Link>
  )
}
