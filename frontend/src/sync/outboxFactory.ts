import type { OutboxItem, OutboxOperation } from '../domain/models'
import { newUuid } from '../db/helpers'

export function createOutboxItem(
  entity: string,
  entityUuid: string,
  operation: OutboxOperation,
  payload: unknown,
): OutboxItem {
  return {
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
  }
}
