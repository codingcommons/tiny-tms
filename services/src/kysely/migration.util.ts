import type { DB } from 'kysely-codegen'

export const onUpdateTrigger = (tableName: keyof DB) => `
CREATE TRIGGER ${tableName}_updated_at
BEFORE UPDATE ON ${tableName}
FOR EACH ROW
EXECUTE PROCEDURE on_update_timestamp();
`
