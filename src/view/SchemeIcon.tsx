import { Icon } from '@chakra-ui/react'
import * as gi from 'react-icons/gi'
import * as ri from 'react-icons/ri'
import * as tb from 'react-icons/tb'
import * as lu from 'react-icons/lu'
import * as bi from 'react-icons/bi'
import * as fa6 from 'react-icons/fa6'
import * as pi from 'react-icons/pi'
import * as fa from 'react-icons/fa'
import * as md from 'react-icons/md'
import schemes from '../schemes.json'
import { IconType } from 'react-icons'
const icons: Record<string, Record<string, IconType>> = {
  gi,
  ri,
  tb,
  lu,
  bi,
  fa6,
  md,
  pi,
  fa
}

export default function SchemeIconView ({
  rank
}: {
  rank: number
}): JSX.Element {
  const schemeData = schemes[rank]
  const iconFamily = icons[schemeData.iconFamily]
  const icon = iconFamily[schemeData.icon]
  return (
    <Icon as={icon} />
  )
}
