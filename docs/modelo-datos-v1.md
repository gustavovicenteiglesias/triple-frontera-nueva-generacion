# Modelo de datos v1 — Nueva Generación

## Hallazgo principal

El modelo actual de Triple Frontera ya permite conservar antecedentes históricos.

La tabla `antecedentes` contiene simultáneamente:

- `id_persona`
- `id_control`
- `uuid`

Por lo tanto, un mismo paciente puede tener distintos registros de antecedentes asociados a distintos controles.

El problema histórico no está en la estructura relacional sino en la forma en que las versiones anteriores utilizaron esa estructura.

## Comportamiento detectado en version3.0

En la pantalla `NuevoEmbarazoControl.tsx`:

1. se crea correctamente un nuevo registro en `controles`;
2. se obtiene el nuevo `id_control`;
3. en lugar de crear un nuevo registro de antecedentes, se actualiza el antecedente existente;
4. ese UPDATE reemplaza su `id_control` por el del nuevo control.

Conceptualmente, el comportamiento actual es:

```text
Antes

Persona
└── Control 2024
    └── Antecedentes A

Nuevo embarazo

Persona
├── Control 2024
└── Control 2026
    └── Antecedentes A  ← el mismo registro fue movido
```

Esto elimina la relación histórica del antecedente con el control anterior.

## Regla para Nueva Generación

Un antecedente perteneciente a un control previo no debe reutilizarse ni reasignarse a un control nuevo.

Cada nuevo embarazo/control debe generar un nuevo registro de antecedentes.

```text
Persona
├── Control 2024
│   └── Antecedentes A
│
└── Control 2026
    └── Antecedentes B
```

El antecedente B puede tomar los valores del antecedente A como base para facilitar la carga, pero debe tener:

- nuevo `uuid`;
- nuevo identificador local;
- `id_persona` de la misma persona;
- `id_control` del nuevo control;
- sus propios valores de `last_modified` y `sql_deleted`.

## Edición

Se permitirá editar un antecedente mientras corresponda al control activo que se está cargando.

Un antecedente histórico de un control anterior no debe modificarse para representar información de un embarazo posterior.

Si fuera necesario corregir un dato histórico por error de carga, esa operación deberá tratarse explícitamente como corrección del registro histórico y no como parte del flujo de un nuevo embarazo.

## Reutilización de información

La nueva PWA puede ofrecer una acción de UX del tipo:

> Usar antecedentes anteriores como base

La aplicación copiará los valores del último antecedente conocido a un objeto nuevo, pero nunca reutilizará el UUID ni el registro anterior.

Ejemplo:

```text
Antecedentes A (2024)
gestas: 3
partos: 2
cesareas: 0
abortos: 0

             copiar como base
                    ↓

Antecedentes B (2026)
gestas: 4
partos: 2
cesareas: 0
abortos: 0
```

## Control como entidad articuladora

Para los datos clínicos del episodio, `controles` funciona como entidad articuladora.

```text
PERSONA
│
├── UBICACIONES
│
└── CONTROLES
     │
     ├── ANTECEDENTES
     ├── CONTROL_EMBARAZO
     ├── LABORATORIOS_REALIZADOS
     ├── INMUNIZACIONES_CONTROL
     ├── ETMIS_PERSONAS
     └── SEGUIMIENTOS / TRATAMIENTOS
```

La ubicación mantiene una relación directa con la persona y puede tener su propia historia.

## Impacto sobre MySQL

Por el momento no se propone crear una tabla `antecedentes_historicos`.

La estructura existente ya soporta el comportamiento requerido. El cambio principal será:

- dejar de actualizar/reasignar el antecedente anterior;
- crear un nuevo antecedente por cada control nuevo;
- preservar los antecedentes anteriores.

Solo se agregarán migraciones si durante la implementación aparecen restricciones o índices necesarios para garantizar esta regla.

## Impacto sobre IndexedDB

IndexedDB debe conservar la misma identidad lógica basada en UUID.

Como mínimo, los stores operativos deberán permitir representar:

```text
personas
controles
antecedentes
ubicaciones
control_embarazo
laboratorios_realizados
inmunizaciones_control
etmis_personas
outbox
sync_meta
```

No se copiarán automáticamente todas las tablas MySQL a IndexedDB. Los catálogos y tablas operativas se definirán según el flujo real de trabajo de la PWA.

## Regla de sincronización

La creación de un nuevo embarazo debe producir operaciones independientes:

1. CREATE control;
2. CREATE antecedentes;
3. CREATE control_embarazo;
4. CREATE laboratorios realizados que correspondan;
5. CREATE inmunizaciones que correspondan;
6. CREATE relaciones ETMI que correspondan.

Cada operación llevará UUID y se incorporará a la outbox local para sincronización idempotente.

No debe existir una operación implícita que cambie el `id_control` de un antecedente histórico para reutilizarlo.
