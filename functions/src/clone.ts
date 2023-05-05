export default function clone <Object> (object: Object): Object {
  const json = JSON.stringify(object)
  return JSON.parse(json)
}
