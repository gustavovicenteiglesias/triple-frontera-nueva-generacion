# Frontend — Triple Frontera Nueva Generación

PWA offline-first construida con React, TypeScript, Vite e IndexedDB.

## Requisitos

- Node.js 20.19 o superior
- npm

## Desarrollo

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Persistencia local

La aplicación usa IndexedDB mediante Dexie.

Stores iniciales:

- personas
- controles
- antecedentes
- ubicaciones
- controlEmbarazo
- laboratoriosRealizados
- inmunizacionesControl
- etmisPersonas
- outbox
- syncMeta

Las relaciones operativas locales se hacen por UUID. Los IDs numéricos del sistema anterior quedan opcionales para compatibilidad/migración.

## Regla de antecedentes

`startNewControl()` implementa la regla central del nuevo modelo:

1. crea un control nuevo;
2. genera UUID nuevo;
3. puede leer el antecedente anterior como referencia;
4. crea un antecedente nuevo con UUID nuevo;
5. nunca reasigna el antecedente histórico;
6. registra ambos CREATE en la outbox dentro de la misma transacción local.

Esto corrige el comportamiento detectado en la versión anterior, donde un nuevo embarazo actualizaba el antecedente existente cambiándole el control asociado.
