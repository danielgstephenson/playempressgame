import { https } from 'firebase-functions'

export default function guardDefined <T> (value: T, label: string): NonNullable<T> {
  if (value == null) {
    throw new https.HttpsError(
      'aborted',
      `${label} is not defined`
    )
  }
  return value
}
