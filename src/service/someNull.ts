export default function someNull <Anything> (...args: Anything[]): boolean {
  return args.some(arg => arg == null)
}
