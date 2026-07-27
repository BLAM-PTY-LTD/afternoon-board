export const DESTINATIONS = [
  { id: 'parent', label: 'Parent pickup', short: 'Pickup', icon: 'P' },
  { id: 'bus-a', label: 'Bus A', short: 'Bus A', icon: 'A' },
  { id: 'bus-b', label: 'Bus B', short: 'Bus B', icon: 'B' },
  { id: 'aftercare', label: 'Aftercare', short: 'Aftercare', icon: '+' },
  { id: 'sports', label: 'Sports / clubs', short: 'Sports', icon: 'S' },
  { id: 'other', label: 'Other / approved adult', short: 'Other', icon: '…' },
]

export const CLASSES = ['3A', '3B', '4A']

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
