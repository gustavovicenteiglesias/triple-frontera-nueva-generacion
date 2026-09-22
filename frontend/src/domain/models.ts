export interface SyncableEntity {
  uuid: string
  lastModified: number
  sqlDeleted: 0 | 1
}

export interface Persona extends SyncableEntity {
  idPersona?: number
  apellido: string
  nombre: string
  documento?: string | null
  fechaNacimiento?: string | null
  sexo?: string | null
}

export interface Control extends SyncableEntity {
  idControl?: number
  idPersonaUuid: string
  fecha: string
  controlNumero: number
  idEstado?: number | null
  fechaFinEmbarazo?: string | null
  idTipoFinEmbarazo?: number | null
  georeferencia?: string | null
}

export interface Antecedente extends SyncableEntity {
  idAntecedente?: number
  idPersonaUuid: string
  idControlUuid: string
  edadPrimerEmbarazo?: number | null
  fechaUltimoEmbarazo?: string | null
  gestas?: number | null
  partos?: number | null
  cesareas?: number | null
  abortos?: number | null
  planificado?: number | null
  fum?: string | null
  fpp?: string | null
}

export interface Ubicacion extends SyncableEntity {
  idUbicacion?: number
  idPersonaUuid: string
  fecha?: string | null
  latitud?: number | null
  longitud?: number | null
  idPais?: number | null
  idArea?: number | null
  idParaje?: number | null
  numeroVivienda?: number | null
}

export interface ControlEmbarazo extends SyncableEntity {
  idControlEmbarazo?: number
  idControlUuid: string
  edadGestacional?: number | null
  eco?: string | null
  detalleEco?: string | null
  hpv?: string | null
  pap?: string | null
  sistolica?: number | null
  diastolica?: number | null
  clinico?: string | null
  observaciones?: string | null
  motivo?: number | null
  derivada?: number | null
}

export interface LaboratorioRealizado extends SyncableEntity {
  idPersonaUuid: string
  idControlUuid: string
  idLaboratorio: number
  idEtmi?: number | null
  trimestre?: number | null
  fechaRealizado?: string | null
  fechaResultados?: string | null
  resultado?: string | null
}

export interface InmunizacionControl extends SyncableEntity {
  idPersonaUuid: string
  idControlUuid: string
  idInmunizacion: number
  estado?: string | null
}

export interface EtmiPersona extends SyncableEntity {
  idPersonaUuid: string
  idControlUuid: string
  idEtmi: number
  confirmada: number
}

export type OutboxOperation = 'CREATE' | 'UPDATE' | 'DELETE'
export type OutboxStatus = 'PENDING' | 'SENDING' | 'ERROR'

export interface OutboxItem {
  id?: number
  operationId: string
  entity: string
  entityUuid: string
  operation: OutboxOperation
  payload: unknown
  status: OutboxStatus
  attempts: number
  createdAt: number
  lastAttemptAt?: number | null
  error?: string | null
}

export interface SyncMeta {
  key: string
  value: string
  updatedAt: number
}
