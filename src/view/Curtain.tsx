import { ReactNode } from 'react'

export default function Curtain ({
  children,
  open,
  hider = <></>
}: {
  children?: ReactNode
  open: boolean
  hider?: JSX.Element
}): JSX.Element {
  const element = open ? children : hider
  return <>{element}</>
}
