import { useEffect, useState } from 'react'
import { db } from './db/database'
import { pendingChangesCount } from './sync/outbox'

function App() {
  const [dbStatus, setDbStatus] = useState('Inicializando IndexedDB…')
  const [pending, setPending] = useState(0)
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const initialize = async () => {
      try {
        await db.open()
        setPending(await pendingChangesCount())
        setDbStatus('IndexedDB disponible')
      } catch (error) {
        console.error(error)
        setDbStatus('No se pudo abrir IndexedDB')
      }
    }

    void initialize()

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Nueva Generación</p>
        <h1>Triple Frontera</h1>
        <p className="lead">
          Base PWA offline-first lista para comenzar el nuevo flujo territorial.
        </p>
      </section>

      <section className="status-grid" aria-label="Estado de la aplicación">
        <article className="status-card">
          <span>Conectividad</span>
          <strong>{online ? 'En línea' : 'Sin conexión'}</strong>
          <small>La carga local debe continuar aun sin Internet.</small>
        </article>

        <article className="status-card">
          <span>Persistencia local</span>
          <strong>{dbStatus}</strong>
          <small>Los datos operativos se almacenan en IndexedDB.</small>
        </article>

        <article className="status-card">
          <span>Sincronización</span>
          <strong>{pending} pendientes</strong>
          <small>La outbox enviará cambios al backend de forma idempotente.</small>
        </article>
      </section>

      <section className="next-step">
        <h2>Próximo flujo</h2>
        <p>
          Buscar persona → seleccionar o crear → iniciar nuevo control → copiar antecedentes
          anteriores como base → guardar un antecedente nuevo → continuar con control de
          embarazo y laboratorios.
        </p>
      </section>
    </main>
  )
}

export default App
