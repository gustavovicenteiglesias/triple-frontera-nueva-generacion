import type { Antecedente } from '../../domain/models'
import { db } from '../../db/database'

/**
 * Obtiene el antecedente del control más reciente como referencia para una nueva carga.
 * El registro devuelto no debe editarse para representar un control nuevo.
 */
export async function getLatestAntecedente(
  personaUuid: string,
): Promise<Antecedente | null> {
  const controles = await db.controles
    .where('idPersonaUuid')
    .equals(personaUuid)
    .filter((control) => control.sqlDeleted === 0)
    .toArray()

  if (controles.length === 0) return null

  const controlMasReciente = controles.sort((a, b) => {
    const byDate = b.fecha.localeCompare(a.fecha)
    if (byDate !== 0) return byDate
    return (b.controlNumero ?? 0) - (a.controlNumero ?? 0)
  })[0]

  return (
    (await db.antecedentes
      .where('idControlUuid')
      .equals(controlMasReciente.uuid)
      .filter((antecedente) => antecedente.sqlDeleted === 0)
      .first()) ?? null
  )
}
