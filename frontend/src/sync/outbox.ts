import type { OutboxOperation } from '../domain/models'
import { db } from '../db/database'
import { newUuid } from '../db/helpers'

export async function enqueueChange(
  entity: string,
  entityUuid: string,
  operation: OutboxOperation,
  payload: unknown,
): Promise<number> {
  const id = await db.outbox.add({
    operationId: newUuid(),
    entity,
    entityUuid,
    operation,
    payload,
    status: 'PENDING',
    attempts: 0,
    createdAt: Date.now(),
    lastAttemptAt: null,
    error: null,
  })

  return id
}

export async function pendingChangesCount(): Promise<number> {
  return db.outbox.where('status').equals('PENDING').count()
}
