import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { useNow, usePersistentState } from './hooks'
import { sampleData } from './sampleData'
import type { Attachment, TaskItem, TeamMember, TedxProjectState } from './types'

const STORAGE_KEY = 'tedx-project-manager-v2'

const EVENT_DATE = '2026-04-23'
const TIMELINE_DAYS = [
  '2026-04-14',
  '2026-04-15',
  '2026-04-16',
  '2026-04-17',
  '2026-04-18',
  '2026-04-19',
  '2026-04-20',
  '2026-04-21',
  '2026-04-22',
  '2026-04-23',
]

const MAX_FILE_BYTES = 2_500_000 // ~2.5 MB per file before we warn

type View = 'today' | 'plan' | 'people'

function normalizeTask(t: Partial<TaskItem>): TaskItem {
  return {
    id: t.id ?? crypto.randomUUID(),
    title: t.title ?? 'Untitled',
    description: t.description ?? '',
    assigneeId: t.assigneeId ?? 'member-daniel',
    coordinateWith: Array.isArray(t.coordinateWith) ? t.coordinateWith : [],
    campus: t.campus ?? 'Cross-campus',
    dueDate: t.dueDate ?? '',
    priority: t.priority ?? 'medium',
    category: t.category ?? 'coordination',
    status: t.status ?? 'Not started',
    subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
    attachments: Array.isArray(t.attachments) ? t.attachments : [],
    sourceLabel: t.sourceLabel,
    sourceTranscript: t.sourceTranscript,
    createdAt: t.createdAt ?? new Date().toISOString(),
  }
}

function normalizeState(state: Partial<TedxProjectState>): TedxProjectState {
  return {
    event: state.event ?? sampleData.event,
    members: Array.isArray(state.members) ? state.members : sampleData.members,
    tasks: Array.isArray(state.tasks) ? state.tasks.map(normalizeTask) : sampleData.tasks,
    speakers: Array.isArray(state.speakers) ? state.speakers : sampleData.speakers,
  }
}

function todayISO(now: Date) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T12:00:00`)
  const db = new Date(`${b}T12:00:00`)
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

function formatDayLong(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatDayShort(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function countdownWord(days: number): string {
  if (days < 0) return `${Math.abs(days)} days past.`
  if (days === 0) return 'Today is the day.'
  if (days === 1) return 'One day out.'
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
  const word = words[days] ?? String(days)
  return `${word.charAt(0).toUpperCase() + word.slice(1)} days out.`
}

function prettyBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export default function App() {
  const now = useNow()
  const [storedData, setStoredData] = usePersistentState<TedxProjectState>(STORAGE_KEY, sampleData)
  const data = useMemo(() => normalizeState(storedData), [storedData])
  const [view, setView] = useState<View>('today')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [storageError, setStorageError] = useState('')

  const today = todayISO(now)
  const daysToEvent = daysBetween(today, EVENT_DATE)

  const peopleMap = useMemo(() => new Map(data.members.map((m) => [m.id, m])), [data.members])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskItem[]>()
    for (const t of data.tasks) {
      const arr = map.get(t.dueDate) ?? []
      arr.push(t)
      map.set(t.dueDate, arr)
    }
    return map
  }, [data.tasks])

  const todaysTasks = tasksByDay.get(today) ?? []
  const tomorrow = TIMELINE_DAYS[TIMELINE_DAYS.indexOf(today) + 1] ?? ''
  const tomorrowsTasks = tomorrow ? tasksByDay.get(tomorrow) ?? [] : []
  const laterTasks = useMemo(
    () =>
      data.tasks
        .filter((t) => t.dueDate > today && t.dueDate !== tomorrow && t.dueDate <= EVENT_DATE)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [data.tasks, today, tomorrow],
  )

  const openCount = data.tasks.filter((t) => t.status !== 'Completed' && t.dueDate <= EVENT_DATE).length
  const doneCount = data.tasks.filter((t) => t.status === 'Completed').length

  const selectedTask = useMemo(
    () => (selectedId ? data.tasks.find((t) => t.id === selectedId) ?? null : null),
    [selectedId, data.tasks],
  )

  const safeSetStoredData = useCallback(
    (updater: (c: TedxProjectState) => TedxProjectState) => {
      try {
        setStoredData((current) => updater(normalizeState(current)))
        setStorageError('')
      } catch (err) {
        console.error(err)
        setStorageError(
          'Could not save. Try removing a large attachment or resetting data.',
        )
      }
    },
    [setStoredData],
  )

  function toggleTaskDone(taskId: string) {
    safeSetStoredData((c) => ({
      ...c,
      tasks: c.tasks.map((t) => {
        if (t.id !== taskId) return t
        const isDone = t.status === 'Completed'
        return {
          ...t,
          status: isDone ? 'Not started' : 'Completed',
          subtasks: t.subtasks.map((s) => ({ ...s, completed: !isDone })),
        }
      }),
    }))
  }

  function updateTask(taskId: string, patch: Partial<TaskItem>) {
    safeSetStoredData((c) => ({
      ...c,
      tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    }))
  }

  function deleteTask(taskId: string) {
    if (!confirm('Delete this task?')) return
    safeSetStoredData((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }))
    setSelectedId(null)
  }

  function addTask() {
    const id = crypto.randomUUID()
    const newTask: TaskItem = {
      id,
      title: 'New task.',
      description: '',
      assigneeId: 'member-daniel',
      coordinateWith: [],
      campus: 'Cross-campus',
      dueDate: today,
      priority: 'medium',
      category: 'coordination',
      status: 'Not started',
      subtasks: [],
      attachments: [],
      createdAt: new Date().toISOString(),
    }
    safeSetStoredData((c) => ({ ...c, tasks: [newTask, ...c.tasks] }))
    setSelectedId(id)
  }

  function resetData() {
    if (confirm('Reset all task progress to the starting list? This removes any new tasks or attachments you added.')) {
      setStoredData(sampleData)
      setSelectedId(null)
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && selectedId) setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  return (
    <div className={`page ${selectedId ? 'inspector-open' : ''}`}>
      <header className="masthead">
        <div className="masthead-top">
          <span className="brand">TEDxFDU</span>
          <nav className="view-nav">
            {(['today', 'plan', 'people'] as View[]).map((v) => (
              <button
                key={v}
                className={`view-link ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <h1 className="countdown-headline">{countdownWord(daysToEvent)}</h1>
        <p className="countdown-sub">
          {formatDayLong(EVENT_DATE)}. Three campuses. Ten speakers. One evening.
        </p>

        <Timeline today={today} tasksByDay={tasksByDay} />
      </header>

      {storageError ? (
        <div className="storage-error">
          {storageError}
          <button className="link-btn" onClick={() => setStorageError('')}>Dismiss</button>
        </div>
      ) : null}

      {view === 'today' ? (
        <main className="content">
          {todaysTasks.length === 0 ? (
            <Section heading="Today" subheading={formatDayLong(today)}>
              <p className="quiet-note">
                Nothing scheduled for today. That's on purpose — rest, or pull something forward.
              </p>
            </Section>
          ) : (
            <Section heading="Today" subheading={formatDayLong(today)}>
              {todaysTasks.map((t) => (
                <Task
                  key={t.id}
                  task={t}
                  peopleMap={peopleMap}
                  onToggle={() => toggleTaskDone(t.id)}
                  onOpen={() => setSelectedId(t.id)}
                />
              ))}
            </Section>
          )}

          {tomorrowsTasks.length > 0 ? (
            <Section heading="Tomorrow" subheading={formatDayLong(tomorrow)} muted>
              {tomorrowsTasks.map((t) => (
                <Task
                  key={t.id}
                  task={t}
                  peopleMap={peopleMap}
                  onToggle={() => toggleTaskDone(t.id)}
                  onOpen={() => setSelectedId(t.id)}
                />
              ))}
            </Section>
          ) : null}

          {laterTasks.length > 0 ? (
            <Section heading="Later this week" muted>
              {laterTasks.map((t) => (
                <Task
                  key={t.id}
                  task={t}
                  peopleMap={peopleMap}
                  onToggle={() => toggleTaskDone(t.id)}
                  onOpen={() => setSelectedId(t.id)}
                  showDate
                  compact
                />
              ))}
            </Section>
          ) : null}

          <PageFoot openCount={openCount} doneCount={doneCount} onAdd={addTask} onReset={resetData} />
        </main>
      ) : null}

      {view === 'plan' ? (
        <main className="content">
          {TIMELINE_DAYS.map((day) => {
            const items = tasksByDay.get(day) ?? []
            const isEvent = day === EVENT_DATE
            const isPast = day < today
            const isToday = day === today
            return (
              <Section
                key={day}
                heading={isEvent ? 'The event' : isToday ? 'Today' : formatDayLong(day)}
                subheading={isEvent ? formatDayLong(day) : isToday ? formatDayLong(day) : undefined}
                muted={isPast && !isToday}
              >
                {items.length === 0 ? (
                  <p className="quiet-note">
                    {isEvent
                      ? 'Show night. Deliver the thing you built.'
                      : isPast
                      ? 'Nothing on this day.'
                      : 'Rest. Space on purpose.'}
                  </p>
                ) : (
                  items.map((t) => (
                    <Task
                      key={t.id}
                      task={t}
                      peopleMap={peopleMap}
                      onToggle={() => toggleTaskDone(t.id)}
                      onOpen={() => setSelectedId(t.id)}
                    />
                  ))
                )}
              </Section>
            )
          })}
          <PageFoot openCount={openCount} doneCount={doneCount} onAdd={addTask} onReset={resetData} />
        </main>
      ) : null}

      {view === 'people' ? (
        <main className="content">
          <p className="page-intro">
            Who you're coordinating with, and what's still pending with each of them.
          </p>
          {data.members
            .map((m) => ({
              member: m,
              open: data.tasks.filter(
                (t) => t.status !== 'Completed' && (t.coordinateWith ?? []).includes(m.id),
              ),
            }))
            .filter((g) => g.open.length > 0)
            .sort((a, b) => b.open.length - a.open.length)
            .map(({ member, open }) => (
              <section key={member.id} className="person-block">
                <div className="person-head">
                  <h2 className="person-name">{member.name}</h2>
                  <span className="person-meta">
                    {member.campus}
                    {member.email ? (
                      <>
                        {' · '}
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </>
                    ) : null}
                  </span>
                </div>
                <p className="person-role">{member.role}</p>
                <ul className="person-tasks">
                  {open.map((t) => (
                    <li key={t.id}>
                      <button
                        className="person-task-open"
                        onClick={() => setSelectedId(t.id)}
                      >
                        <span className="person-task-title">{t.title}</span>
                        <span className="person-task-when">{formatDayShort(t.dueDate)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </main>
      ) : null}

      {selectedTask ? (
        <>
          <div className="inspector-backdrop" onClick={() => setSelectedId(null)} />
          <Inspector
            task={selectedTask}
            members={data.members}
            onClose={() => setSelectedId(null)}
            onChange={(patch) => updateTask(selectedTask.id, patch)}
            onDelete={() => deleteTask(selectedTask.id)}
            onToggleDone={() => toggleTaskDone(selectedTask.id)}
            onStorageError={setStorageError}
          />
        </>
      ) : null}
    </div>
  )
}

function Timeline({
  today,
  tasksByDay,
}: {
  today: string
  tasksByDay: Map<string, TaskItem[]>
}) {
  return (
    <ol className="timeline" aria-label="Timeline">
      {TIMELINE_DAYS.map((day) => {
        const items = tasksByDay.get(day) ?? []
        const allDone = items.length > 0 && items.every((t) => t.status === 'Completed')
        const isToday = day === today
        const isEvent = day === EVENT_DATE
        const isPast = day < today
        const label = new Date(`${day}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
        })
        const cls = [
          'tl-node',
          isToday ? 'is-today' : '',
          isEvent ? 'is-event' : '',
          isPast && !isToday ? 'is-past' : '',
          allDone ? 'is-done' : '',
          items.length === 0 && !isEvent ? 'is-empty' : '',
        ]
          .filter(Boolean)
          .join(' ')
        return (
          <li key={day} className={cls}>
            <span className="tl-dot" aria-hidden />
            <span className="tl-label">{isEvent ? 'Show' : label}</span>
            {items.length > 0 && !isEvent ? (
              <span className="tl-count">{items.filter((t) => t.status !== 'Completed').length}</span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function Section({
  heading,
  subheading,
  muted,
  children,
}: {
  heading: string
  subheading?: string
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={`section ${muted ? 'muted' : ''}`}>
      <div className="section-head">
        <h2 className="section-heading">{heading}</h2>
        {subheading ? <p className="section-sub">{subheading}</p> : null}
      </div>
      <div className="section-body">{children}</div>
    </section>
  )
}

function Task({
  task,
  peopleMap,
  onToggle,
  onOpen,
  showDate,
  compact,
}: {
  task: TaskItem
  peopleMap: Map<string, TeamMember>
  onToggle: () => void
  onOpen: () => void
  showDate?: boolean
  compact?: boolean
}) {
  const done = task.status === 'Completed'
  const coords = (task.coordinateWith ?? [])
    .map((id) => peopleMap.get(id)?.name)
    .filter(Boolean) as string[]
  const hasAttach = (task.attachments ?? []).length > 0
  const hasTranscript = !!task.sourceTranscript

  return (
    <article className={`task ${done ? 'done' : ''} ${compact ? 'compact' : ''}`}>
      <button
        className="task-check"
        onClick={onToggle}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
      >
        {done ? '✓' : ''}
      </button>
      <button className="task-body" onClick={onOpen} aria-label="Open task">
        <h3 className="task-title">{task.title}</h3>
        {!compact && task.description ? <p className="task-desc">{task.description}</p> : null}
        <div className="task-foot">
          {coords.length > 0 ? (
            <span className="task-with">
              With <em>{coords.join(', ')}</em>
            </span>
          ) : null}
          <span className="task-meta-icons">
            {hasAttach ? <span className="meta-pill" title="Has attachments">{(task.attachments ?? []).length} file{task.attachments!.length === 1 ? '' : 's'}</span> : null}
            {hasTranscript ? <span className="meta-pill" title="Has source transcript">source</span> : null}
          </span>
          {showDate ? <span className="task-date">{formatDayShort(task.dueDate)}</span> : null}
        </div>
      </button>
    </article>
  )
}

function PageFoot({
  openCount,
  doneCount,
  onAdd,
  onReset,
}: {
  openCount: number
  doneCount: number
  onAdd: () => void
  onReset: () => void
}) {
  return (
    <footer className="page-foot">
      <span>{openCount} open · {doneCount} done</span>
      <div className="page-foot-actions">
        <button className="link-btn" onClick={onAdd}>+ New task</button>
        <button className="link-btn subtle" onClick={onReset}>Reset</button>
      </div>
    </footer>
  )
}

function Inspector({
  task,
  members,
  onClose,
  onChange,
  onDelete,
  onToggleDone,
  onStorageError,
}: {
  task: TaskItem
  members: TeamMember[]
  onClose: () => void
  onChange: (patch: Partial<TaskItem>) => void
  onDelete: () => void
  onToggleDone: () => void
  onStorageError: (msg: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const done = task.status === 'Completed'

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const added: Attachment[] = []
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        onStorageError(
          `"${file.name}" is ${prettyBytes(file.size)} — too big for local storage. Keep attachments under ${prettyBytes(MAX_FILE_BYTES)}.`,
        )
        continue
      }
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
        added.push({
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl,
          addedAt: new Date().toISOString(),
        })
      } catch {
        onStorageError(`Couldn't read "${file.name}".`)
      }
    }
    if (added.length > 0) {
      onChange({ attachments: [...(task.attachments ?? []), ...added] })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeAttachment(id: string) {
    onChange({ attachments: (task.attachments ?? []).filter((a) => a.id !== id) })
  }

  function toggleCoord(memberId: string) {
    const has = (task.coordinateWith ?? []).includes(memberId)
    onChange({
      coordinateWith: has
        ? (task.coordinateWith ?? []).filter((id) => id !== memberId)
        : [...(task.coordinateWith ?? []), memberId],
    })
  }

  return (
    <aside className="inspector" role="dialog" aria-label="Task details">
      <div className="inspector-head">
        <button className="inspector-close" onClick={onClose} aria-label="Close">
          ←
        </button>
        <div className="inspector-actions">
          <button className={`inspector-done ${done ? 'is-done' : ''}`} onClick={onToggleDone}>
            {done ? '✓ Done' : 'Mark done'}
          </button>
          <button className="inspector-delete" onClick={onDelete} aria-label="Delete task">
            Delete
          </button>
        </div>
      </div>

      <div className="inspector-scroll">
        <label className="field">
          <span className="field-label">Title</span>
          <textarea
            className="field-input field-title"
            value={task.title}
            onChange={(e) => onChange({ title: e.target.value })}
            rows={2}
            placeholder="What needs to happen?"
          />
        </label>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="field-input field-desc"
            value={task.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={6}
            placeholder="The context for future-you — why this matters, what success looks like."
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Scheduled for</span>
            <input
              type="date"
              className="field-input"
              value={task.dueDate}
              onChange={(e) => onChange({ dueDate: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Priority</span>
            <select
              className="field-input"
              value={task.priority}
              onChange={(e) => onChange({ priority: e.target.value as TaskItem['priority'] })}
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>

        <div className="field">
          <span className="field-label">Coordinate with</span>
          <div className="coord-grid">
            {members
              .filter((m) => m.id !== 'member-daniel')
              .map((m) => {
                const on = (task.coordinateWith ?? []).includes(m.id)
                return (
                  <button
                    key={m.id}
                    className={`coord-chip ${on ? 'on' : ''}`}
                    onClick={() => toggleCoord(m.id)}
                    type="button"
                  >
                    {m.name}
                  </button>
                )
              })}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Attachments</span>
          <div className="attach-list">
            {(task.attachments ?? []).map((a) => (
              <AttachmentTile key={a.id} attachment={a} onRemove={() => removeAttachment(a.id)} />
            ))}
          </div>
          <div className="attach-add">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx,.txt,.md"
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
            <button
              className="attach-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              + Attach file
            </button>
            <span className="attach-hint">
              Images or PDFs, under {prettyBytes(MAX_FILE_BYTES)} each.
            </span>
          </div>
        </div>

        {task.sourceTranscript ? (
          <div className="field transcript-field">
            <span className="field-label">
              Source
              {task.sourceLabel ? <span className="field-label-tail"> · {task.sourceLabel}</span> : null}
            </span>
            <pre className="transcript">{task.sourceTranscript}</pre>
          </div>
        ) : (
          <div className="field">
            <span className="field-label">Source</span>
            <textarea
              className="field-input"
              value={task.sourceTranscript ?? ''}
              onChange={(e) => onChange({ sourceTranscript: e.target.value })}
              rows={4}
              placeholder="Paste the email, message, or note this task came from. It'll stay with the task for your review later."
            />
            <input
              type="text"
              className="field-input"
              style={{ marginTop: 8 }}
              value={task.sourceLabel ?? ''}
              onChange={(e) => onChange({ sourceLabel: e.target.value })}
              placeholder="Source label — e.g., “Scott's email, April 13”"
            />
          </div>
        )}
      </div>
    </aside>
  )
}

function AttachmentTile({
  attachment,
  onRemove,
}: {
  attachment: Attachment
  onRemove: () => void
}) {
  const isImage = attachment.type.startsWith('image/')
  const isPdf = attachment.type === 'application/pdf'

  return (
    <div className="attach-tile">
      {isImage ? (
        <a href={attachment.dataUrl} target="_blank" rel="noreferrer" className="attach-thumb">
          <img src={attachment.dataUrl} alt={attachment.name} />
        </a>
      ) : (
        <a
          href={attachment.dataUrl}
          download={attachment.name}
          className="attach-thumb attach-doc"
        >
          <span className="attach-icon">{isPdf ? 'PDF' : 'FILE'}</span>
        </a>
      )}
      <div className="attach-meta">
        <a
          href={attachment.dataUrl}
          download={attachment.name}
          className="attach-name"
          title={attachment.name}
        >
          {attachment.name}
        </a>
        <span className="attach-size">{prettyBytes(attachment.size)}</span>
      </div>
      <button className="attach-remove" onClick={onRemove} aria-label="Remove attachment">
        ×
      </button>
    </div>
  )
}
