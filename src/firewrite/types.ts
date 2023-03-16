import { HttpsCallableResult, Functions } from 'firebase/functions'
import { FC } from 'react'

export type CloudCaller = <Props> (props?: Props) => Promise<HttpsCallableResult<unknown> | undefined>

export interface WriteProps <Props extends {}> {
  fn: string
  label: string
  onCall?: (caller: CloudCaller, props: Props) => Promise<void>
  props?: Props
  WriteView: FC
}

export interface WritingProps <Props extends {}> extends WriteProps<Props> {
  functions: Functions
}

export interface WriterProps <Props extends {}> extends WriteProps<Props> {
  functions?: Functions
}

export interface WriteState {
  write?: () => Promise<void>
  loading?: boolean
  error?: Error | undefined
  label?: string
}
