import { useEffect, useMemo, useState } from 'react'
import {
  CLASSES,
  DESTINATIONS,
  createInitialStudents,
  destinationMeta,
  formatTime,
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

  function updateDestination(studentId, destinationId, note, by = 'Parent') {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              todayDestination: destinationId,
              note: note.trim(),
              changedAt: new Date().toISOString(),
              changedBy: by,
            }
          : s,
      ),
    )
    const name = students.find((s) => s.id === studentId)?.name
    setFlash(`${name}'s afternoon plan updated`)
    window.setTimeout(() => setFlash(null), 2800)
  }

  function resetToDefault(studentId) {
    const student = students.find((s) => s.id === studentId)
    if (!student) return
    updateDestination(studentId, student.defaultDestination, '', 'Parent')
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
        </nav>
      </header>

      <main className="stage">
        <p className="date-line">{todayLabel()}</p>

        {role === 'parent' ? (
          <ParentView
            children={parentChildren}
            activeChild={activeChild}
            onSelectChild={setActiveChildId}
            pastCutoff={pastCutoff}
            onSave={updateDestination}
            onReset={resetToDefault}
          />
        ) : (
          <StaffBoard
            students={boardStudents}
            classFilter={classFilter}
            onClassFilter={setClassFilter}
            changeCount={changeCount}
            pastCutoff={pastCutoff}
            onOfficeOverride={(id, dest, note) => updateDestination(id, dest, note, 'Office')}
          />
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

function ParentView({ children, activeChild, onSelectChild, pastCutoff, onSave, onReset }) {
  const [dest, setDest] = useState(activeChild.todayDestination)
  const [note, setNote] = useState(activeChild.note)
  const [savedPulse, setSavedPulse] = useState(false)

  useEffect(() => {
    setDest(activeChild.todayDestination)
    setNote(activeChild.note)
  }, [activeChild.id, activeChild.todayDestination, activeChild.note])

  const defaultMeta = destinationMeta(activeChild.defaultDestination)
  const isChanged = dest !== activeChild.defaultDestination || note.trim().length > 0
  const dirty =
    dest !== activeChild.todayDestination || note.trim() !== (activeChild.note || '').trim()

  function handleSave() {
    if (pastCutoff) return
    onSave(activeChild.id, dest, note)
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 600)
  }

  return (
    <section className="parent-view">
      <div className="intro">
        <h1>Where is {activeChild.name.split(' ')[0]} going today?</h1>
        <p>Tell the school before dismissal. Teachers see this on the live board.</p>
      </div>

      <div className="child-picker" role="tablist" aria-label="Your children">
        {children.map((c) => (
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
          <strong>{defaultMeta.label}</strong>
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
                  onChange={() => setDest(d.id)}
                />
                <span className="dest-icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span className="dest-label">{d.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

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
              onReset(activeChild.id)
            }}
          >
            Reset to usual
          </button>
          <button
            type="button"
            className="primary"
            disabled={pastCutoff || !dirty}
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
                {s.note ? (
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
                  onSave={(dest, note) => {
                    onOfficeOverride(s.id, dest, note)
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
  const [dest, setDest] = useState(student.todayDestination)
  const [note, setNote] = useState(student.note)

  return (
    <div className="office-editor">
      <select value={dest} onChange={(e) => setDest(e.target.value)}>
        {DESTINATIONS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={note}
        placeholder="Office note"
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="button" className="primary compact" onClick={() => onSave(dest, note)}>
        Save
      </button>
      <button type="button" className="ghost compact" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

export default App
