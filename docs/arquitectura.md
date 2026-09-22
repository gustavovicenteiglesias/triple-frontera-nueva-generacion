# Arquitectura inicial

## Visión general

```text
PWA React
   │
   ├── IndexedDB
   │     ├── datos locales
   │     └── outbox de cambios pendientes
   │
   └── servicio de sincronización
           │
           ▼
      Spring Boot API
           │
           ▼
          MySQL
```

## Principios

1. **Offline-first:** la aplicación debe seguir operativa aunque no exista conexión.
2. **Persistencia local real:** los datos de trabajo se almacenan en IndexedDB.
3. **Sincronización explícita y tolerante a fallos:** cada operación pendiente debe poder reintentarse sin duplicar información.
4. **UUID desde origen:** la identidad de los registros no depende de IDs autoincrementales del servidor.
5. **Backend evolutivo:** se reutiliza la lógica existente siempre que siga siendo válida y se modifica cuando la nueva arquitectura lo requiera.
6. **Base de datos evolutiva:** los cambios de esquema se realizan mediante migraciones versionadas.
7. **Historia de antecedentes:** los antecedentes deben poder reconstruirse temporalmente y no perderse por sobrescritura.

## Próximos pasos

- Traducir el modelo actual a un esquema local adecuado para IndexedDB.
- Definir la estrategia de outbox y sincronización.
- Rediseñar el modelo de antecedentes para conservar historia.
- Diseñar el nuevo flujo funcional y las nuevas vistas.
- Recién después comenzar la implementación de pantallas y casos de uso.
