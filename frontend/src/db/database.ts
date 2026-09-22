import Dexie, { type Table } from 'dexie'
import type {
  Antecedente,
  Control,
  ControlEmbarazo,
  EtmiPersona,
  InmunizacionControl,
  LaboratorioRealizado,
  OutboxItem,
  Persona,
  SyncMeta,
  Ubicacion,
} from '../domain/models'

export class TripleFronteraDatabase extends Dexie {
  personas!: Table<Persona, string>
  controles!: Table<Control, string>
  antecedentes!: Table<Antecedente, string>
  ubicaciones!: Table<Ubicacion, string>
  controlEmbarazo!: Table<ControlEmbarazo, string>
  laboratoriosRealizados!: Table<LaboratorioRealizado, string>
  inmunizacionesControl!: Table<InmunizacionControl, string>
  etmisPersonas!: Table<EtmiPersona, string>
  outbox!: Table<OutboxItem, number>
  syncMeta!: Table<SyncMeta, string>

  constructor() {
    super('triple-frontera')

    this.version(1).stores({
      personas: '&uuid, idPersona, documento, apellido, nombre, lastModified, sqlDeleted',
      controles: '&uuid, idControl, idPersonaUuid, fecha, controlNumero, lastModified, sqlDeleted',
      antecedentes: '&uuid, idAntecedente, idPersonaUuid, idControlUuid, lastModified, sqlDeleted',
      ubicaciones: '&uuid, idUbicacion, idPersonaUuid, fecha, lastModified, sqlDeleted',
      controlEmbarazo: '&uuid, idControlEmbarazo, idControlUuid, lastModified, sqlDeleted',
      laboratoriosRealizados:
        '&uuid, idPersonaUuid, idControlUuid, idLaboratorio, idEtmi, fechaRealizado, lastModified, sqlDeleted',
      inmunizacionesControl:
        '&uuid, idPersonaUuid, idControlUuid, idInmunizacion, lastModified, sqlDeleted',
      etmisPersonas:
        '&uuid, idPersonaUuid, idControlUuid, idEtmi, lastModified, sqlDeleted',
      outbox:
        '++id, &operationId, entity, entityUuid, operation, status, createdAt, lastAttemptAt',
      syncMeta: '&key, updatedAt',
    })
  }
}

export const db = new TripleFronteraDatabase()
