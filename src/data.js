export const DESTINATIONS = [
  { id: 'parent', label: 'Parent pickup', short: 'Pickup', icon: 'P' },
  { id: 'bus-a', label: 'Bus A', short: 'Bus A', icon: 'A' },
  { id: 'bus-b', label: 'Bus B', short: 'Bus B', icon: 'B' },
  { id: 'aftercare', label: 'Aftercare', short: 'Aftercare', icon: '+' },
  { id: 'sports', label: 'Sports / clubs', short: 'Sports', icon: 'S' },
  { id: 'other', label: 'Other / approved adult', short: 'Other', icon: '…' },
]

export const CLASSES = ['3A', '3B', '4A']

/** Registered family vehicles used for carline matching. */
export const CARS = [
  {
    id: 'car-chen-suv',
    label: 'Chen SUV',
    color: 'Silver',
    make: 'Toyota RAV4',
    plate: 'ABC-124',
    swatch: '#c0c6cc',
    parentIds: ['Priya Chen'],
  },
  {
    id: 'car-blake-wagon',
    label: 'Blake wagon',
    color: 'Blue',
    make: 'Mazda 6',
    plate: 'BLU-882',
    swatch: '#3a6ea5',
    parentIds: ['Sam Blake'],
  },
  {
    id: 'car-santos-ute',
    label: 'Santos ute',
    color: 'White',
    make: 'Ford Ranger',
    plate: 'RAN-441',
    swatch: '#e8ebe8',
    parentIds: ['Carla Santos'],
  },
  {
    id: 'car-quinn-nan',
    label: 'Nan’s hatch',
    color: 'Blue',
    make: 'Toyota Corolla',
    plate: 'NAN-019',
    swatch: '#4a7ab0',
    parentIds: ['Jordan Quinn', 'Margaret Quinn'],
  },
  {
    id: 'car-nguyen-sedan',
    label: 'Nguyen sedan',
    color: 'Grey',
    make: 'Hyundai i30',
    plate: 'GRY-307',
    swatch: '#8a9096',
    parentIds: ['Linh Nguyen'],
  },
  {
    id: 'car-rahman-suv',
    label: 'Rahman SUV',
    color: 'Black',
    make: 'Kia Sportage',
    plate: 'BLK-550',
    swatch: '#2b2f33',
    parentIds: ['Nadia Rahman'],
  },
]

const today = () => new Date().toISOString().slice(0, 10)

export function createInitialStudents() {
  const date = today()
  return [
    {
      id: 's1',
      name: 'Amelia Chen',
      classId: '3A',
      defaultDestination: 'bus-a',
      todayDestination: 'bus-a',
      defaultCarId: 'car-chen-suv',
      todayCarId: null,
      carlineStatus: 'waiting',
      note: '',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Priya Chen',
    },
    {
      id: 's2',
      name: 'Noah Blake',
      classId: '3A',
      defaultDestination: 'parent',
      todayDestination: 'parent',
      defaultCarId: 'car-blake-wagon',
      todayCarId: 'car-blake-wagon',
      carlineStatus: 'waiting',
      note: '',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Sam Blake',
    },
    {
      id: 's3',
      name: 'Mia Patel',
      classId: '3A',
      defaultDestination: 'aftercare',
      todayDestination: 'aftercare',
      defaultCarId: null,
      todayCarId: null,
      carlineStatus: 'waiting',
      note: '',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Anika Patel',
    },
    {
      id: 's4',
      name: 'Leo Santos',
      classId: '3A',
      defaultDestination: 'bus-b',
      todayDestination: 'sports',
      defaultCarId: 'car-santos-ute',
      todayCarId: null,
      carlineStatus: 'waiting',
      note: 'Soccer until 4:30 — pickup at oval gate',
      changedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      changedBy: 'Parent',
      date,
      parentName: 'Carla Santos',
    },
    {
      id: 's5',
      name: 'Harper Quinn',
      classId: '3B',
      defaultDestination: 'parent',
      todayDestination: 'other',
      defaultCarId: 'car-quinn-nan',
      todayCarId: 'car-quinn-nan',
      carlineStatus: 'arrived',
      note: 'Nan — Margaret Quinn (blue Toyota)',
      changedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      changedBy: 'Parent',
      date,
      parentName: 'Jordan Quinn',
    },
    {
      id: 's6',
      name: 'Ethan Walsh',
      classId: '3B',
      defaultDestination: 'bus-a',
      todayDestination: 'bus-a',
      defaultCarId: null,
      todayCarId: null,
      carlineStatus: 'waiting',
      note: '',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Chris Walsh',
    },
    {
      id: 's7',
      name: 'Sofia Nguyen',
      classId: '3B',
      defaultDestination: 'aftercare',
      todayDestination: 'parent',
      defaultCarId: 'car-nguyen-sedan',
      todayCarId: 'car-nguyen-sedan',
      carlineStatus: 'waiting',
      note: 'Dad collecting early for dentist',
      changedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      changedBy: 'Parent',
      date,
      parentName: 'Linh Nguyen',
    },
    {
      id: 's8',
      name: 'Jack Murray',
      classId: '4A',
      defaultDestination: 'bus-b',
      todayDestination: 'bus-b',
      defaultCarId: null,
      todayCarId: null,
      carlineStatus: 'waiting',
      note: '',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Tessa Murray',
    },
    {
      id: 's9',
      name: 'Isla Rahman',
      classId: '4A',
      defaultDestination: 'parent',
      todayDestination: 'aftercare',
      defaultCarId: 'car-rahman-suv',
      todayCarId: null,
      carlineStatus: 'waiting',
      note: '',
      changedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      changedBy: 'Office',
      date,
      parentName: 'Nadia Rahman',
    },
    {
      id: 's10',
      name: 'Oliver Park',
      classId: '4A',
      defaultDestination: 'sports',
      todayDestination: 'sports',
      defaultCarId: null,
      todayCarId: null,
      carlineStatus: 'waiting',
      note: 'Basketball — usual',
      changedAt: null,
      changedBy: null,
      date,
      parentName: 'Min Park',
    },
  ]
}

export function destinationMeta(id) {
  return DESTINATIONS.find((d) => d.id === id) ?? DESTINATIONS[0]
}

export function carMeta(id) {
  return CARS.find((c) => c.id === id) ?? null
}

export function carsForParent(parentName) {
  return CARS.filter((c) => c.parentIds.includes(parentName))
}

export function needsCar(destinationId) {
  return destinationId === 'parent' || destinationId === 'other'
}

export function formatTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function todayLabel() {
  return new Date().toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function carDisplay(car) {
  if (!car) return 'No car set'
  return `${car.color} ${car.make}`
}
