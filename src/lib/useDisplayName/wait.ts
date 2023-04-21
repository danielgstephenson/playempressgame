export default async function wait (milliseconds: number): Promise<void> {
  return await new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}
