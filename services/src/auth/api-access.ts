import type { Insertable, Selectable } from 'kysely'
import type { Apiaccess } from 'kysely-codegen'
import { z } from 'zod'

export type ApiKeyCreationParams = Insertable<Omit<Apiaccess, 'id' | 'created_at'>>
export type SelectableApiKey = Selectable<Apiaccess>

const apiKeyIdSchema = z.number().brand('api-access')
export type ApiKeyId = z.infer<typeof apiKeyIdSchema>

const apiKeyKeySchema = z.string().uuid().brand('api-key')
export type ApiKey = z.infer<typeof apiKeyKeySchema>

const apiAccessSchema = z.object({
  id: apiKeyIdSchema,
  apikey: apiKeyKeySchema,
  name: z.string(),
  project_id: z.number(),
  created_at: z.date(),
  updated_at: z.date()
})
export type ApiAccess = z.infer<typeof apiAccessSchema>
