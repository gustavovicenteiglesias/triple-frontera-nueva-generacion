# Decisión 001 — Antecedentes históricos por control

**Estado:** aceptada

## Contexto

El esquema existente relaciona `antecedentes` con `personas` y con `controles`. Al revisar la rama `version3.0` del sistema anterior se comprobó que, al iniciar un nuevo embarazo, se crea un nuevo control pero se actualiza el registro de antecedentes existente y se le asigna el nuevo `id_control`.

Ese comportamiento hace perder la asociación histórica con el control anterior.

## Decisión

La Nueva Generación conservará la tabla y el concepto actual de antecedentes, pero modificará su uso:

- un nuevo control genera un nuevo antecedente;
- nunca se reasigna un antecedente anterior a otro control;
- se pueden copiar valores del antecedente anterior para facilitar la carga;
- el nuevo registro siempre recibe un UUID nuevo;
- los registros históricos se conservan.

## Consecuencia

No se necesita, por ahora, una tabla adicional de antecedentes históricos.

El problema se resuelve aplicando correctamente el modelo existente y cambiando el flujo de creación/edición en la nueva PWA y, cuando corresponda, en el backend.
