import type { Insertable, Selectable } from 'kysely'
import type { Projects } from 'kysely-codegen'
import { z } from 'zod'

export type PojectCreationParams = Insertable<
  Omit<Projects, 'id' | 'created_at' | 'updated_at' | 'base_language'>
>
export type SelectableProject = Selectable<Projects>

const projectIdSchema = z.number().brand('projectId')
export type ProjectId = z.infer<typeof projectIdSchema>

const projectSchema = z.object({
  id: projectIdSchema,
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  base_language: z.number().nullable()
})
export type Project = z.infer<typeof projectSchema>
