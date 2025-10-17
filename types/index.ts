import { Client, User, Project, Template, Roadmap, UserRole, ClientStatut, ProjectStatut, TemplateSecteur } from '@prisma/client'

// Re-export Prisma types
export type { Client, User, Project, Template, Roadmap }
export { UserRole, ClientStatut, ProjectStatut, TemplateSecteur }

// Extended types with relations
export type ClientWithRelations = Client & {
  users?: User[]
  projects?: Project[]
  _count?: {
    users: number
    projects: number
  }
}

export type ProjectWithRelations = Project & {
  client?: Client
  template?: Template | null
  createdBy?: User
  updatedBy?: User | null
}

export type UserWithClient = User & {
  client: Client
}

// Scoring criteria type
export type ScoringCriteria = {
  [key: string]: {
    label: string
    description: string
    weight: number
  }
}

// Project scores type
export type ProjectScores = {
  [key: string]: number
}

// Weight configuration for prioritization
export type WeightConfig = {
  [key: string]: number
}
