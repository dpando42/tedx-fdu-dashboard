import type { TaskFilters, TaskItem, TaskPriority, TaskStatus, TeamMember } from './types'

const MS_PER_DAY = 86_400_000

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export function sortTasks(tasks: TaskItem[]): TaskItem[] {
  return [...tasks].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority ?? 'low']
    const pb = PRIORITY_ORDER[b.priority ?? 'low']
    if (pa !== pb) return pa - pb
    return a.dueDate.localeCompare(b.dueDate)
  })
}

export function getTaskCompletion(task: TaskItem) {
  const total = task.subtasks.length
  const done = task.subtasks.filter((subtask) => subtask.completed).length
  return {
    done,
    total,
    progress: total === 0 ? (task.status === 'Completed' ? 100 : 0) : Math.round((done / total) * 100),
  }
}

export function normalizeStatusFromSubtasks(task: TaskItem): TaskStatus {
  if (task.subtasks.length === 0) return task.status
  const { done, total } = getTaskCompletion(task)
  if (done === 0) return 'Not started'
  if (done === total) return 'Completed'
  return 'In progress'
}

export function filterTasks(tasks: TaskItem[], filters: TaskFilters, _now: Date) {
  return tasks.filter((task) => {
    const lowerSearch = filters.search.toLowerCase()

    const matchesSearch =
      lowerSearch.length === 0 ||
      task.title.toLowerCase().includes(lowerSearch) ||
      task.description.toLowerCase().includes(lowerSearch)

    const matchesCampus = filters.campus === 'all' || task.campus === filters.campus
    const matchesStatus = filters.status === 'all' || task.status === filters.status
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchesCoordinate =
      filters.coordinateWithId === 'all' ||
      (task.coordinateWith ?? []).includes(filters.coordinateWithId)

    return matchesSearch && matchesCampus && matchesStatus && matchesPriority && matchesCoordinate
  })
}

export function buildDashboard(tasks: TaskItem[]) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const blocked = tasks.filter((task) => task.status === 'Blocked').length
  const critical = tasks.filter((task) => task.priority === 'critical' && task.status !== 'Completed').length

  return {
    total,
    completed,
    blocked,
    critical,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function buildPeopleMap(members: TeamMember[]) {
  return new Map(members.map((member) => [member.id, member]))
}

export function daysUntil(dateStr: string): number {
  const due = new Date(`${dateStr}T23:59:59`)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / MS_PER_DAY)
}

export function formatDueLabel(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days}d`
}

export function dueLabelUrgency(dateStr: string, status: TaskStatus): 'ok' | 'soon' | 'urgent' | 'overdue' {
  if (status === 'Completed') return 'ok'
  const days = daysUntil(dateStr)
  if (days < 0) return 'overdue'
  if (days <= 1) return 'urgent'
  if (days <= 3) return 'soon'
  return 'ok'
}
