import { useEffect, useMemo, useState } from 'react'
import {
  CLASSES,
  DESTINATIONS,
  carDisplay,
  carMeta,
  carsForParent,
  createInitialStudents,
  destinationMeta,
  formatTime,
  needsCar,
  todayLabel,
} from './data'
import './App.css'

const CUTOFF_HOUR = 14
const CUTOFF_MINUTE = 30

function isPastCutoff() {
  const now = new Date()
  return now.getHours() > CUTOFF_HOUR || (now.getHours() === CUTOFF_HOUR && now.getMinutes() >= CUTOFF_MINUTE)
}

function App() {
  const [role, setRole] = useState('parent')
  const [students, setStudents] = useState(createInitialStudents)
  const [activeChildId, setActiveChildId] = useState('s1')
  const [classFilter, setClassFilter] = useState('3A')
  const [flash, setFlash] = useState(null)

  const pastCutoff = isPastCutoff()
  const parentChildren = useMemo(
    () => students.filter((s) => ['s1', 's2'].includes(s.id)),
    [students],
  )
  const activeChild = students.find((s) => s.id === activeChildId) ?? parentChildren[0]

  function updatePlan(studentId, { destinationId, note, carId, by = 'Parent' }) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s
        const dest = destinationId ?? s.todayDestination
        const nextCar = needsCar(dest) ? (carId ?? s.todayCarId ?? s.defaultCarId) : null
        return {
          ...s,
          todayDestination: dest,
          todayCarId: nextCar,
          note: (note ?? s.note).trim(),
          carlineStatus: needsCar(dest) ? s.carlineStatus || 'waiting' : 'waiting',
          changedAt: new Date().toISOString(),
          changedBy: by,
        }
      }),
    )
    const name = students.find((s) => s.id === studentId)?.name
    setFlash(`${name}'s afternoon plan updated`)
    window.setTimeout(() => setFlash(null), 2800)
  }

  function resetToDefault(studentId) {
    const student = students.find((s) => s.id === studentId)
    if (!student) return
    updatePlan(studentId, {
      destinationId: student.defaultDestination,
      note: '',
      carId: needsCar(student.defaultDestination) ? student.defaultCarId : null,
      by: 'Parent',
    })
  }

  function setCarlineStatus(studentId, status) {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, carlineStatus: status } : s)),
    )
    const name = students.find((s) => s.id === studentId)?.name
    const labels = { waiting: 'waiting', arrived: 'car arrived', loaded: 'loaded' }
    setFlash(`${name}: ${labels[status] || status}`)
    window.setTimeout(() => setFlash(null), 2200)
  }

  const boardStudents = students
    .filter((s) => classFilter === 'all' || s.classId === classFilter)
    .sort((a, b) => {
      const aChanged = a.todayDestination !== a.defaultDestination || !!a.changedAt ? 0 : 1
      const bChanged = b.todayDestination !== b.defaultDestination || !!b.changedAt ? 0 : 1
      if (aChanged !== bChanged) return aChanged - bChanged
      return a.name.localeCompare(b.name)
    })

  const changeCount = boardStudents.filter(
    (s) => s.todayDestination !== s.defaultDestination || s.changedAt,
  ).length

  const carlineStudents = students
    .filter((s) => needsCar(s.todayDestination) && s.todayCarId)
    .sort((a, b) => {
      const order = { arrived: 0, waiting: 1, loaded: 2 }
      const ao = order[a.carlineStatus] ?? 9
      const bo = order[b.carlineStatus] ?? 9
      if (ao !== bo) return ao - bo
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-block">
          <p className="brand">Afternoon Board</p>
          <p className="school">Riverside Primary · demo</p>
        </div>

        <nav className="role-switch" aria-label="View as">
          <button
            type="button"
            className={role === 'parent' ? 'active' : ''}
            onClick={() => setRole('parent')}
          >
            Parent
          </button>
          <button
            type="button"
            className={role === 'staff' ? 'active' : ''}
            onClick={() => setRole('staff')}
          >
            Staff board
          </button>
          <button
            type="button"
            className={role === 'carline' ? 'active' : ''}
            onClick={() => setRole('carline')}
          >
            Carline
          </button>
        </nav>
      </header>

      <main className="stage">
        <p className="date-line">{todayLabel()}</p>

        {role === 'parent' ? (
          <ParentView
            kids={parentChildren}
            activeChild={activeChild}
            onSelectChild={setActiveChildId}
            pastCutoff={pastCutoff}
            onSave={(id, dest, note, carId) =>
              updatePlan(id, { destinationId: dest, note, carId, by: 'Parent' })
            }
            onReset={resetToDefault}
          />
        ) : role === 'staff' ? (
          <StaffBoard
            students={boardStudents}
            classFilter={classFilter}
            onClassFilter={setClassFilter}
            changeCount={changeCount}
            pastCutoff={pastCutoff}
            onOfficeOverride={(id, dest, note, carId) =>
              updatePlan(id, { destinationId: dest, note, carId, by: 'Office' })
            }
          />
        ) : (
          <CarlineBoard students={carlineStudents} onStatus={setCarlineStatus} />
        )}
      </main>

      {flash && (
        <div className="toast" role="status">
          {flash}
        </div>
      )}
    </div>
  )
}

function ParentView({ kids, activeChild, onSelectChild, pastCutoff, onSave, onReset }) {
  const familyCars = carsForParent(activeChild.parentName)
  const [dest, setDest] = useState(activeChild.todayDestination)
  const [note, setNote] = useState(activeChild.note)
  const [carId, setCarId] = useState(activeChild.todayCarId || activeChild.defaultCarId || '')
  const [savedPulse, setSavedPulse] = useState(false)

  useEffect(() => {
    setDest(activeChild.todayDestination)
    setNote(activeChild.note)
    setCarId(activeChild.todayCarId || activeChild.defaultCarId || '')
  }, [
    activeChild.id,
    activeChild.todayDestination,
    activeChild.note,
    activeChild.todayCarId,
    activeChild.defaultCarId,
  ])

  const defaultMeta = destinationMeta(activeChild.defaultDestination)
  const showCar = needsCar(dest)
  const isChanged =
    dest !== activeChild.defaultDestination ||
    note.trim().length > 0 ||
    (showCar && carId !== activeChild.defaultCarId)
  const dirty =
    dest !== activeChild.todayDestination ||
    note.trim() !== (activeChild.note || '').trim() ||
    (showCar && carId !== (activeChild.todayCarId || ''))

  function handleSave() {
    if (pastCutoff) return
    if (showCar && !carId) return
    onSave(activeChild.id, dest, note, showCar ? carId : null)
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 600)
  }

  return (
    <section className="parent-view">
      <div className="intro">
        <h1>Where is {activeChild.name.split(' ')[0]} going today?</h1>
        <p>Tell the school before dismissal. Teachers see this on the live board and carline.</p>
      </div>

      <div className="child-picker" role="tablist" aria-label="Your children">
        {kids.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === activeChild.id}
            className={c.id === activeChild.id ? 'selected' : ''}
            onClick={() => onSelectChild(c.id)}
          >
            <span className="child-name">{c.name}</span>
            <span className="child-class">Year {c.classId}</span>
          </button>
        ))}
      </div>

      <div className={`plan-panel ${savedPulse ? 'pulse' : ''}`}>
        <div className="usual-row">
          <span>Usual plan</span>
          <strong>
            {defaultMeta.label}
            {needsCar(activeChild.defaultDestination) && activeChild.defaultCarId
              ? ` · ${carDisplay(carMeta(activeChild.defaultCarId))}`
              : ''}
          </strong>
        </div>

        {pastCutoff && (
          <div className="cutoff-banner" role="alert">
            Changes are locked after 2:30pm. Call the office for last-minute updates.
          </div>
        )}

        <fieldset disabled={pastCutoff} className="dest-fieldset">
          <legend>Today&apos;s destination</legend>
          <div className="dest-grid">
            {DESTINATIONS.map((d) => (
              <label key={d.id} className={`dest-option ${dest === d.id ? 'on' : ''}`}>
                <input
                  type="radio"
                  name="destination"
                  value={d.id}
                  checked={dest === d.id}
                  onChange={() => {
                    setDest(d.id)
                    if (needsCar(d.id) && !carId) {
                      setCarId(activeChild.defaultCarId || familyCars[0]?.id || '')
                    }
                  }}
                />
                <span className="dest-icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span className="dest-label">{d.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {showCar && (
          <fieldset disabled={pastCutoff} className="dest-fieldset car-fieldset">
            <legend>Carline vehicle</legend>
            <p className="car-hint">Staff will match your child to this car at pickup.</p>
            {familyCars.length === 0 ? (
              <p className="car-empty">No registered cars — add a note describing the vehicle.</p>
            ) : (
              <div className="car-grid">
                {familyCars.map((c) => (
                  <label key={c.id} className={`car-option ${carId === c.id ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name="car"
                      value={c.id}
                      checked={carId === c.id}
                      onChange={() => setCarId(c.id)}
                    />
                    <span className="car-swatch" style={{ background: c.swatch }} aria-hidden="true" />
                    <span className="car-copy">
                      <span className="car-label">{c.label}</span>
                      <span className="car-detail">
                        {c.color} {c.make} · {c.plate}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        )}

        <label className="note-field">
          <span>Note for teachers (optional)</span>
          <textarea
            rows={2}
            value={note}
            disabled={pastCutoff}
            placeholder="e.g. Grandma collecting — red hatchback"
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <div className="actions">
          <button
            type="button"
            className="ghost"
            disabled={pastCutoff || !isChanged}
            onClick={() => {
              setDest(activeChild.defaultDestination)
              setNote('')
              setCarId(activeChild.defaultCarId || '')
              onReset(activeChild.id)
            }}
          >
            Reset to usual
          </button>
          <button
            type="button"
            className="primary"
            disabled={pastCutoff || !dirty || (showCar && !carId && familyCars.length > 0)}
            onClick={handleSave}
          >
            Update school
          </button>
        </div>

        {activeChild.changedAt && (
          <p className="audit">
            Last updated {formatTime(activeChild.changedAt)} by {activeChild.changedBy}
          </p>
        )}
      </div>
    </section>
  )
}

function StaffBoard({
  students,
  classFilter,
  onClassFilter,
  changeCount,
  pastCutoff,
  onOfficeOverride,
}) {
  const [editingId, setEditingId] = useState(null)

  return (
    <section className="staff-view">
      <div className="intro staff-intro">
        <div>
          <h1>Dismissal board</h1>
          <p>
            {changeCount === 0
              ? 'All students on their usual plan.'
              : `${changeCount} change${changeCount === 1 ? '' : 's'} for this class.`}
          </p>
        </div>
        <div className={`cutoff-chip ${pastCutoff ? 'locked' : 'open'}`}>
          {pastCutoff ? 'Cutoff passed' : 'Accepting updates until 2:30'}
        </div>
      </div>

      <div className="filters">
        <button
          type="button"
          className={classFilter === 'all' ? 'active' : ''}
          onClick={() => onClassFilter('all')}
        >
          All
        </button>
        {CLASSES.map((c) => (
          <button
            key={c}
            type="button"
            className={classFilter === c ? 'active' : ''}
            onClick={() => onClassFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="board" role="list">
        {students.map((s) => {
          const meta = destinationMeta(s.todayDestination)
          const car = carMeta(s.todayCarId)
          const changed = s.todayDestination !== s.defaultDestination || !!s.changedAt
          const isEditing = editingId === s.id

          return (
            <article
              key={s.id}
              className={`board-row ${changed ? 'changed' : ''}`}
              role="listitem"
            >
              <div className="student-id">
                <span className="avatar">{s.name.charAt(0)}</span>
                <div>
                  <p className="name">{s.name}</p>
                  <p className="meta">
                    {s.classId}
                    {changed && s.changedAt ? ` · ${formatTime(s.changedAt)}` : ''}
                  </p>
                </div>
              </div>

              <div className={`dest-pill dest-${s.todayDestination}`}>
                <span className="pill-icon">{meta.icon}</span>
                <span>{meta.short}</span>
              </div>

              <div className="row-detail">
                {car && needsCar(s.todayDestination) ? (
                  <p className="note">
                    <span className="inline-swatch" style={{ background: car.swatch }} />
                    {car.color} {car.make}
                    {s.note ? ` · ${s.note}` : ''}
                  </p>
                ) : s.note ? (
                  <p className="note">{s.note}</p>
                ) : changed ? (
                  <p className="note muted">Changed from {destinationMeta(s.defaultDestination).short}</p>
                ) : (
                  <p className="note muted">Usual plan</p>
                )}
              </div>

              <button
                type="button"
                className="override"
                onClick={() => setEditingId(isEditing ? null : s.id)}
              >
                {isEditing ? 'Close' : 'Office'}
              </button>

              {isEditing && (
                <OfficeEditor
                  student={s}
                  onSave={(dest, note, nextCarId) => {
                    onOfficeOverride(s.id, dest, note, nextCarId)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function OfficeEditor({ student, onSave, onCancel }) {
  const familyCars = carsForParent(student.parentName)
  const [dest, setDest] = useState(student.todayDestination)
  const [note, setNote] = useState(student.note)
  const [carId, setCarId] = useState(student.todayCarId || student.defaultCarId || '')

  return (
    <div className={`office-editor ${needsCar(dest) && familyCars.length ? 'with-car' : ''}`}>
      <select value={dest} onChange={(e) => setDest(e.target.value)}>
        {DESTINATIONS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>
      {needsCar(dest) && familyCars.length > 0 && (
        <select value={carId} onChange={(e) => setCarId(e.target.value)}>
          {familyCars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} · {c.plate}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        value={note}
        placeholder="Office note"
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="button"
        className="primary compact"
        onClick={() => onSave(dest, note, needsCar(dest) ? carId : null)}
      >
        Save
      </button>
      <button type="button" className="ghost compact" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

function CarlineBoard({ students, onStatus }) {
  const waiting = students.filter((s) => s.carlineStatus === 'waiting').length
  const arrived = students.filter((s) => s.carlineStatus === 'arrived').length
  const loaded = students.filter((s) => s.carlineStatus === 'loaded').length

  return (
    <section className="carline-view">
      <div className="intro staff-intro">
        <div>
          <h1>Carline</h1>
          <p>Match each student to the car parents chose for today.</p>
        </div>
        <div className="carline-stats" aria-label="Carline counts">
          <span>
            <strong>{arrived}</strong> at curb
          </span>
          <span>
            <strong>{waiting}</strong> waiting
          </span>
          <span>
            <strong>{loaded}</strong> gone
          </span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="carline-empty">
          <p>No students on carline right now.</p>
          <p className="muted">Parent pickup and approved-adult plans with a car show up here.</p>
        </div>
      ) : (
        <div className="carline-board" role="list">
          {students.map((s) => {
            const car = carMeta(s.todayCarId)
            return (
              <article
                key={s.id}
                className={`carline-card status-${s.carlineStatus}`}
                role="listitem"
              >
                <div className="carline-car">
                  <span
                    className="car-swatch large"
                    style={{ background: car?.swatch || '#ccc' }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="car-plate">{car?.plate || '—'}</p>
                    <p className="car-detail">
                      {car ? `${car.color} ${car.make}` : 'Unknown vehicle'}
                    </p>
                  </div>
                </div>

                <div className="carline-student">
                  <p className="name">{s.name}</p>
                  <p className="meta">
                    {s.classId}
                    {s.note ? ` · ${s.note}` : ''}
                  </p>
                </div>

                <div className="carline-actions">
                  <button
                    type="button"
                    className={s.carlineStatus === 'waiting' ? 'active-status' : ''}
                    onClick={() => onStatus(s.id, 'waiting')}
                  >
                    Waiting
                  </button>
                  <button
                    type="button"
                    className={s.carlineStatus === 'arrived' ? 'active-status arrived' : ''}
                    onClick={() => onStatus(s.id, 'arrived')}
                  >
                    Arrived
                  </button>
                  <button
                    type="button"
                    className={s.carlineStatus === 'loaded' ? 'active-status loaded' : ''}
                    onClick={() => onStatus(s.id, 'loaded')}
                  >
                    Loaded
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default App
