import { useSensor, PointerSensor, useSensors, SensorDescriptor, SensorOptions } from '@dnd-kit/core'

export default function usePointerSensor (): Array<SensorDescriptor<SensorOptions>> {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  const sensors = useSensors(sensor)
  return sensors
}
