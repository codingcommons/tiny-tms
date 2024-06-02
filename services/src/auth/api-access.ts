import type { Insertable, Selectable } from 'kysely'
import type { Apiaccess } from 'kysely-codegen'
import { z } from 'zod'

export type ApiKeyCreationParams = Insertable<Omit<Apiaccess, 'id' | 'created_at'>>
export type SelectableApiKey = Selectable<Apiaccess>

const apiAccessIdSchema = z.number().brand('api-access')
export type ApiAccessId = z.infer<typeof apiAccessIdSchema>

const apiKeyKeySchema = z.string().uuid().brand('api-key')
export type ApiKey = z.infer<typeof apiKeyKeySchema>

export const apiAccessSchema = z.object({
  id: apiAccessIdSchema,
  apikey: apiKeyKeySchema,
  name: z.string(),
  project_id: z.number(),
  created_at: z.date(),
  updated_at: z.date()
})
export type ApiAccess = z.infer<typeof apiAccessSchema>
