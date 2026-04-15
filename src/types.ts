export type Campus = 'Florham' | 'Metro' | 'Vancouver' | 'Remote' | 'Cross-campus' | 'Unknown'

export type TaskStatus = 'Not started' | 'In progress' | 'Completed' | 'Blocked' | 'Unclear'

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type TaskCategory = 'production' | 'coordination' | 'logistics' | 'content' | 'comms'

export interface TeamMember {
  id: string
  name: string
  campus: string
  email: string
  role: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
  addedAt: string
}

export interface TaskItem {
  id: string
  title: string
  description: string
  assigneeId: string
  coordinateWith: string[]
  campus: Campus | string
  dueDate: string
  priority: TaskPriority
  category: TaskCategory
  status: TaskStatus
  subtasks: Subtask[]
  attachments: Attachment[]
  sourceLabel?: string
  sourceTranscript?: string
  createdAt: string
}

export interface EventVenue {
  campus: string
  venue: string
  localTime: string
}

export interface Speaker {
  id: string
  name: string
  campus: string
  venue: string
  title: string
}

export interface TedxProjectState {
  event: {
    name: string
    date: string
    summary: string
    venues: EventVenue[]
  }
  members: TeamMember[]
  tasks: TaskItem[]
  speakers: Speaker[]
}

export interface TaskFilters {
  campus: string
  priority: 'all' | TaskPriority
  status: 'all' | TaskStatus
  coordinateWithId: string
  search: string
}
