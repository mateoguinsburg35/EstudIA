# Plan de tareas de EstudIA

Las tareas están ordenadas por **dependencias técnicas**: cada una solo depende de las anteriores. Cada fila indica número, título, agente responsable, descripción, RN/HU asociadas, criterio de aceptación y estado.

**Agentes:** *Estudiante* = decisiones, revisión y validación manual; *Claude* = asistente de IA que redacta, implementa y propone pruebas bajo la dirección del estudiante.
**Fuente de verdad:** `docs/spec.md`. Detalles técnicos en `docs/plan.md`.

## Fase 0 – Definición y reglas de trabajo

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T1 | Definir la idea y el alcance | Estudiante + Claude | Redactar `docs/idea.md` con problema, propuesta de valor y alcance (incluido y excluido). | — | La idea se entiende sin leer el código y delimita lo que la app no hace. | Completada |
| T2 | Fijar glosario del dominio | Claude | Redactar `docs/glosario.md` (Materia, Tarea, Examen, Bloque horario, Pomodoro, Offline-first, Fusión por marcas de tiempo). | — | Cada término tiene una definición única y sin ambigüedad. | Completada |
| T3 | Redactar el reglamento de trabajo | Estudiante + Claude | Crear `AGENTS.md`: stack, ubicación de archivos, convenciones y fuente de verdad. | RN42 | Un agente nuevo puede ubicarse en el repo leyendo solo ese archivo. | Completada |
| T4 | Escribir la especificación | Claude | Redactar `docs/spec.md` con objetivo, roles, alcance, RN, HU, casos borde y pendientes. | Todas | Toda RN está cubierta por al menos una HU; los pendientes están en cero. | Completada |
| T5 | Diseñar la arquitectura | Claude | Redactar `docs/plan.md`: modelo de datos, almacenamiento local y estrategia de sincronización. | RN28–RN40 | El modelo de datos y el flujo de sincronización están justificados. | Completada |

## Fase 1 – Base de la aplicación

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T6 | Estructura SPA y enrutamiento de vistas | Claude | `index.html` con menú y contenedor; `app.js` con tabla `VISTAS`, `render()` y delegación de eventos con `data-accion`. | RN43 / HU28 | Cambiar de vista no recarga la página y el ítem activo queda marcado. | Completada |
| T7 | Sistema de diseño con tema claro/oscuro | Claude | `estilos.css` con variables de color, tema según el sistema, diseño adaptable (≤760 px), zonas seguras y movimiento reducido. | RN44 / HU29 | La app es legible y usable en celular y escritorio, en claro y oscuro. | Completada |
| T8 | Utilidades de fechas y escape de HTML | Claude | `fechaAIso`, `isoAFecha`, `diasHasta`, `textoDias`, `escaparHtml`, `enlazar`. | RN7, RN41 | Los textos con HTML no se ejecutan; las fechas relativas son correctas. | Completada |
| T9 | Persistencia local con marcas de modificación | Claude | `cargarDatos`, `guardarLocal`, `estampar`, `leerMeta/guardarMeta`, migración de datos sin marca, `storage.persist`. | RN28, RN29 / HU27 | Los datos sobreviven a recargar; si falla el guardado, se avisa. | Completada |
| T10 | Formulario modal genérico | Claude | `abrirFormulario` con campos `text`, `select`, `date`, `time`, `color`, `textarea` y casillas múltiples de días; validación de obligatorios. | RN1, RN4 | Un solo componente sirve para todos los formularios y no envía campos obligatorios vacíos. | Completada |
| T11 | Avisos y eliminación con deshacer | Claude | `mostrarAviso`, `eliminarConDeshacer`, lápidas en `eliminados`. | RN30 / HU2 | Todo borrado se puede deshacer durante 7 s y deja lápida. | Completada |

## Fase 2 – Gestión académica

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T12 | CRUD de materias | Claude | Vista Materias, formulario, color rotativo, contadores. | RN1, RN2 / HU1 | No se pueden crear actividades sin materia; el color inicial rota. | Completada |
| T13 | Eliminación en cascada de materias | Claude | `eliminarMateria` elimina tareas, exámenes y clases asociadas con un único Deshacer. | RN3 / HU2 | Deshacer restaura la materia y todo lo asociado. | Completada |
| T14 | CRUD de tareas | Claude | Vista Tareas, tipo, prioridad, descripción con enlaces, casilla de completada, selector de prioridad en línea. | RN4, RN6, RN7 / HU4, HU6, HU7 | Una tarea vencida pendiente se resalta; completada no. | Completada |
| T15 | Tareas semanales recurrentes | Claude | `crearTareasSemanales` con opciones 1/4/8/16 solo al crear. | RN5 / HU5 | Se crean N tareas independientes separadas 7 días. | Completada |
| T16 | CRUD de exámenes | Claude | Vista Exámenes, próximos/pasados, prioridad por defecto alta. | RN8 / HU8 | Un examen de hoy es próximo; uno de ayer es pasado. | Completada |
| T17 | Búsqueda, filtros y orden por prioridad | Claude | `filtros.js`: texto + materia + orden, contadores, reinicio si se elimina la materia filtrada. | RN9 / HU9 | Filtros combinados con Y; el orden conserva la fecha dentro de cada prioridad. | Completada |
| T18 | Secciones desplegables persistentes | Claude | `<details>` con estado guardado en `estudia:meta:v1`. | RN10 / HU9 | El estado abierto/cerrado se mantiene al recargar. | Completada |
| T19 | Detalle de materia | Claude | Panel desplegable con pendientes y próximos exámenes; cierre por cruz o segundo clic. | RN14 / HU3 | Solo un detalle abierto a la vez. | Completada |

## Fase 3 – Vistas de resumen

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T20 | Calendario mensual | Claude | Grilla con semana desde el lunes, hasta 3 chips por día y «+N», día seleccionado. | RN15 / HU11 | Los formularios proponen el día seleccionado. | Completada |
| T21 | Panel diario y progreso | Claude | Porcentaje global y por materia, actividades de hoy, tareas y exámenes próximos. | RN11–RN13 / HU10 | 4 de 10 tareas completadas muestra 40 %; sin tareas muestra 0 %. | Completada |
| T22 | Página de presentación | Claude | `presentacion.js`: logo SVG, propuesta, seis funciones y botón de ingreso como vista inicial. | RN43 / HU28 | Es lo primero que se ve y el logo vuelve a ella. | Completada |

## Fase 4 – Horario de cursada

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T23 | Modelo de clases y validación | Claude | `horario.js`: formulario con días múltiples; exige ≥1 día y fin > inicio. | RN16 / HU12 | Los datos inválidos devuelven el formulario con lo escrito. | Completada |
| T24 | Detección de superposiciones | Claude | `buscarSuperposicion` con intervalos abiertos y confirmación «Guardar igual». | RN17 / HU13 | Consecutivas no chocan; solapadas informan día, materia y horario. | Completada |
| T25 | Clases repetidas por grupo | Claude | Una entrada por día unidas por `grupo`; `miembrosDeClase`, `clasesAgrupadas`, texto de días. | RN18 / HU12 | Se lista una sola vez; «Todos los días» con 7 días. | Completada |
| T26 | Edición y eliminación de clases repetidas | Claude | Reutilizar entradas, crear faltantes, eliminar sobrantes y borrar el grupo con Deshacer. | RN19, RN20 / HU14, HU15 | Editar no deja entradas huérfanas. | Completada |
| T27 | Grilla semanal | Claude | Bloques posicionados por hora, rango dinámico (mín. 08–18), día actual resaltado. | RN21 / HU16 | Una clase tardía amplía el rango visible. | Completada |

## Fase 5 – Modo Enfoque

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T28 | Temporizador Pomodoro | Claude | `enfoque.js`: estudio/descanso, iniciar, pausar, reiniciar, alarma y vibración. | RN22–RN24 / HU17 | Cambio automático de fase; pausa conserva el restante. | Completada |
| T29 | Reloj por instante de fin | Claude | `finPrevisto` en lugar de contar ticks; `actualizarReloj` cada segundo. | RN23 / HU17 | El tiempo es exacto con la pestaña en segundo plano. | Completada |
| T30 | Pastilla flotante | Claude | Indicador visible fuera de la vista Enfoque. | RN25 / HU18 | Aparece solo con el temporizador activo. | Completada |
| T31 | Modo No molestar | Claude | Retención de avisos y liberación conjunta; excepción para avisos con Deshacer. | RN26 / HU19 | Los avisos se muestran juntos al pausar o terminar el estudio. | Completada |
| T32 | Sonido de fondo con Web Audio | Claude | Ruido blanco y marrón generados en el navegador, solo durante el estudio. | RN27 / HU20 | Suena al iniciar y se detiene al pausar o descansar. | Completada |

## Fase 6 – Respaldo y sincronización

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T33 | Exportación de copias | Claude | `exportarCopia` genera JSON con aplicación, versión y fecha. | RN31 / HU21 | El archivo se descarga con nombre fechado. | Completada |
| T34 | Importación con validación y restauración | Claude | `leerCopia`, confirmación destructiva, `reemplazarDatos` con lápidas. | RN32, RN33 / HU22 | Un archivo inválido no altera datos; lo ausente no reaparece. | Completada |
| T35 | Recordatorio de respaldo | Claude | `avisoDeCopia` con umbral de 14 días y exclusiones. | RN34 / HU23 | No aparece con sesión, copia reciente o No molestar. | Completada |
| T36 | Configuración de Supabase y secretos | Estudiante + Claude | Proyecto Supabase, tabla `datos_usuario`, RLS por `usuario_id`, `configuracion.js` solo con clave pública. | RN35, RN37, RN42 | Un usuario no puede leer ni escribir datos de otro; no hay claves de servicio en el repo. | Completada |
| T37 | Autenticación por enlace | Claude | `signInWithOtp`, control de `file://`, sesión con `onAuthStateChange`. | RN36 / HU24 | El enlace inicia sesión y dispara la primera sincronización. | Completada |
| T38 | Fusión por marcas de tiempo | Claude | `fusionarDatos`: gana el mayor `modificado`, empate local, unión de lápidas. | RN38 / HU26 | Casos de conflicto, borrado y re-edición resueltos como en la spec. | Completada |
| T39 | Ciclo de sincronización | Claude | Lectura, fusión, subida, *debounce* de 1,5 s, cola de pendientes y disparadores. | RN39, RN40 / HU25, HU27 | Nunca corren dos a la vez; un fallo no pierde datos. | Completada |

## Fase 7 – Verificación, documentación final y entrega

| N° | Título | Agente | Descripción | RN / HU | Criterio de aceptación | Estado |
|---|---|---|---|---|---|---|
| T40 | Pruebas de validación horaria | Estudiante + Claude | Casos: choque, consecutivas, edición propia, varios días, fin ≤ inicio. | RN16–RN20 / HU12–HU15 | Todos los casos con resultado esperado en `informe-pruebas.md`. | Completada |
| T41 | Pruebas del temporizador | Estudiante + Claude | Fases, pausa, segundo plano, reinicio, No molestar, sonido. | RN22–RN27 / HU17–HU20 | Todos los casos con resultado esperado. | Completada |
| T42 | Pruebas de sincronización y copias | Estudiante + Claude | Dos dispositivos, edición/borrado concurrente, sin conexión, restauración. | RN31–RN40 / HU21–HU27 | Todos los casos con resultado esperado. | Completada |
| T43 | Pruebas de reglas de datos y progreso | Estudiante + Claude | Recurrencia, cascada, porcentajes, filtros, calendario. | RN3–RN15 / HU1–HU11 | Todos los casos con resultado esperado. | Completada |
| T44 | Registrar decisiones y preguntas | Estudiante + Claude | Completar `docs/decisiones.md` y `docs/preguntas-abiertas.md`. | — | Cada decisión tiene tema, alternativa descartada y motivo. | Completada |
| T45 | Informe de pruebas | Claude | Redactar `docs/informe-pruebas.md` con resultados y justificación del orden de las tareas. | Todas | Cada RN tiene al menos una prueba registrada. | Completada |
| T46 | Despliegue público | Estudiante | Publicar en un hosting estático con HTTPS (necesario para el inicio de sesión). | RN36 | El enlace público abre la app y permite iniciar sesión. | Completada |
| T47 | README y cierre | Claude | Redactar `README.md` con descripción, uso, estructura, enlace público y documentación. | — | Un lector nuevo puede usar y ubicar todo desde el README. | Completada |

## Justificación del orden

1. **Definición antes de código:** idea, glosario y reglas de trabajo (Fase 0) fijan el lenguaje y la fuente de verdad.
2. **Base antes que funciones:** el estado, el almacenamiento, el escape de HTML y el formulario genérico (Fase 1) son requeridos por todo lo demás; el deshacer y las lápidas se resuelven temprano porque la sincronización depende de ellos.
3. **Datos antes que resúmenes:** el panel diario y el calendario (Fase 3) necesitan materias, tareas y exámenes (Fase 2).
4. **Horario y Enfoque** (Fases 4 y 5) son módulos independientes entre sí; el horario precede al panel solo en lectura (clases de hoy), por eso el panel solo consume funciones del horario ya existentes.
5. **Respaldo antes que nube:** las copias (T33–T35) validan el esquema y las lápidas antes de exponerlos a conflictos de sincronización (T36–T39).
6. **Verificación al final** (Fase 7): las pruebas se agrupan por módulo y el informe y el README cierran el proyecto con el enlace público ya disponible.