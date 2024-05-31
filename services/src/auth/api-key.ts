import type { Insertable, Selectable } from 'kysely'
import type { Apikeys } from 'kysely-codegen'
import { z } from 'zod'

export type ApiKeyCreationParams = Insertable<Omit<Apikeys, 'id' | 'created_at'>>
export type SelectableApiKey = Selectable<Apikeys>

const apiKeyIdSchema = z.number().brand('apiKeyId')
export type ApiKeyId = z.infer<typeof apiKeyIdSchema>

const apiKeyKeySchema = z.string().uuid().brand('apiKeyKey')
export type ApiKeyKey = z.infer<typeof apiKeyKeySchema>

const apiKeySchema = z.object({
  id: apiKeyIdSchema,
  key: apiKeyKeySchema,
  name: z.string(),
  project_id: z.number(),
  created_at: z.date(),
  updated_at: z.date()
})
export type ApiKey = z.infer<typeof apiKeySchema>

const frontendApiKeySchema = apiKeySchema.omit({
  id: true
})
