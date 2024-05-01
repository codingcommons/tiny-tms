import { Insertable, Selectable } from 'kysely'
import { User } from 'kysely-codegen'

export type UserCreationParams = Insertable<Omit<User, 'id' | 'created_at'>>
export type SelectableUser = Selectable<User>
