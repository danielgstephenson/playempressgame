import { ReactNode } from 'react'

export default function Curtain ({
  children,
  open,
  hider = <></>
}: {
  children?: ReactNode
  open?: boolean
  hider?: JSX.Element | false
}): JSX.Element {
  const element = open === true ? children : hider
  return <>{element}</>
}
