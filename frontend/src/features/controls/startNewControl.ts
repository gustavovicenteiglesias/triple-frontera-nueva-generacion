import type { Antecedente, Control } from '../../domain/models'
import { db } from '../../db/database'
import { newUuid, nowUnix } from '../../db/helpers'
import { createOutboxItem } from '../../sync/outboxFactory'

export interface StartNewControlInput {
  personaUuid: string
  fecha: string
  idEstado?: number | null
  georeferencia?: string | null
  antecedenteAnterior?: Antecedente | null
  cambiosAntecedente?: Partial<
    Pick<
      Antecedente,
      | 'edadPrimerEmbarazo'
      | 'fechaUltimoEmbarazo'
      | 'gestas'
      | 'partos'
      | 'cesareas'
      | 'abortos'
      | 'planificado'
      | 'fum'
      | 'fpp'
    >
  >
}

export interface StartNewControlResult {
  control: Control
  antecedente: Antecedente
}

/**
 * Inicia un nuevo episodio/control para una persona.
 *
 * Regla central:
 * - jamás modifica ni reasigna el antecedente de un control anterior;
 * - si existe antecedenteAnterior, copia sus valores como base;
 * - genera UUID nuevos para control y antecedente;
 * - persiste control + antecedente + outbox en una única transacción local.
 */
export async function startNewControl(
  input: StartNewControlInput,
): Promise<StartNewControlResult> {
  return db.transaction(
    'rw',
    db.controles,
    db.antecedentes,
    db.outbox,
    async () => {
      const controlesPersona = await db.controles
        .where('idPersonaUuid')
        .equals(input.personaUuid)
        .filter((control) => control.sqlDeleted === 0)
        .toArray()

      const controlNumero =
        controlesPersona.reduce(
          (max, control) => Math.max(max, control.controlNumero ?? 0),
          0,
        ) + 1

      const timestamp = nowUnix()
      const controlUuid = newUuid()
      const antecedenteUuid = newUuid()

      const control: Control = {
        uuid: controlUuid,
        idPersonaUuid: input.personaUuid,
        fecha: input.fecha,
        controlNumero,
        idEstado: input.idEstado ?? 1,
        georeferencia: input.georeferencia ?? null,
        fechaFinEmbarazo: null,
        idTipoFinEmbarazo: null,
        lastModified: timestamp,
        sqlDeleted: 0,
      }

      const anterior = input.antecedenteAnterior
      const cambios = input.cambiosAntecedente ?? {}

      const antecedente: Antecedente = {
        uuid: antecedenteUuid,
        idPersonaUuid: input.personaUuid,
        idControlUuid: controlUuid,
        edadPrimerEmbarazo:
          cambios.edadPrimerEmbarazo ?? anterior?.edadPrimerEmbarazo ?? null,
        fechaUltimoEmbarazo:
          cambios.fechaUltimoEmbarazo ?? anterior?.fechaUltimoEmbarazo ?? null,
        gestas: cambios.gestas ?? anterior?.gestas ?? null,
        partos: cambios.partos ?? anterior?.partos ?? null,
        cesareas: cambios.cesareas ?? anterior?.cesareas ?? null,
        abortos: cambios.abortos ?? anterior?.abortos ?? null,
        planificado: cambios.planificado ?? null,
        fum: cambios.fum ?? null,
        fpp: cambios.fpp ?? null,
        lastModified: timestamp,
        sqlDeleted: 0,
      }

      await db.controles.add(control)
      await db.antecedentes.add(antecedente)

      await db.outbox.bulkAdd([
        createOutboxItem('controles', control.uuid, 'CREATE', control),
        createOutboxItem('antecedentes', antecedente.uuid, 'CREATE', antecedente),
      ])

      return { control, antecedente }
    },
  )
}
