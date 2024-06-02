import type { Insertable, Selectable } from 'kysely'
import type { Apiaccess } from 'kysely-codegen'
import { z } from 'zod'

export type ApiKeyCreationParams = Insertable<Omit<Apiaccess, 'id' | 'created_at'>>
export type SelectableApiKey = Selectable<Apiaccess>

const apiAccessIdSchema = z.number().brand('api-access')
export type ApiAccessId = z.infer<typeof apiAccessIdSchema>

export const apiKeySchema = z.string().uuid().brand('api-key')
export type ApiKey = z.infer<typeof apiKeySchema>

export const apiAccessSchema = z.object({
  id: apiAccessIdSchema,
  apikey: apiKeySchema,
  name: z.string(),
  project_id: z.number(),
  created_at: z.date(),
  updated_at: z.date()
})
export type ApiAccess = z.infer<typeof apiAccessSchema>
