# Informe de pruebas de EstudIA

Plan y registro de las pruebas funcionales de las reglas de negocio principales. Cada caso indica los pasos, el resultado esperado y un espacio para registrar el resultado obtenido.

## 1. Datos de la ejecución

| Campo | Valor |
|---|---|
| Aplicación probada | https://mateoguinsburg35.github.io/EstudIA/ |
| Fecha de ejecución | _completar_ |
| Responsable | _completar_ |
| Navegador y versión (escritorio) | _completar_ |
| Dispositivo y navegador (celular) | _completar_ |

## 2. Método

- **Tipo:** pruebas funcionales manuales de caja negra, basadas en los criterios de aceptación de `docs/spec.md`.
- **Estado inicial:** salvo indicación, se parte de datos vacíos (borrar los datos del sitio o usar una ventana privada).
- **Resultado:** marcar **OK** si coincide con lo esperado o **FALLA** si no, y anotar lo observado. Si falla, abrir una corrección y volver a ejecutar el caso.
- **Evidencia:** capturas de pantalla guardadas en `docs/evidencias/` con el nombre del caso (por ejemplo, `PH-03.png`).
- Todo caso con resultado **FALLA** debe quedar resuelto y re-ejecutado antes de la entrega.

## 3. Resumen

| Bloque | Casos | OK | FALLA |
|---|---|---|---|
| Superposición horaria (PH) | 8 | | |
| Pomodoro (PT) | 9 | | |
| Sincronización (PS) | 9 | | |
| Copias de seguridad (PC) | 7 | | |
| Cascada y deshacer (PK) | 5 | | |
| Otras reglas de datos (PD) | 6 | | |
| **Total** | **44** | | |

## 4. Casos de prueba

### 4.1 Superposición y validación horaria (RN16 a RN21 · HU12 a HU16)

Precondición: existen las materias «Matemática» y «Física».

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PH-01 | Cargar Matemática, lunes 08:00–10:00. | Se guarda sin aviso y aparece en la grilla y en la lista. | OK |
| PH-02 | Cargar Física, lunes 09:00–11:00. | Aviso «Horario ocupado» que indica lunes, Matemática y 08:00 a 10:00. «Cancelar» no guarda; «Guardar igual» guarda. | OK |
| PH-03 | Cargar Física, lunes 10:00–12:00 (consecutiva). | Se guarda sin aviso. | OK |
| PH-04 | Cargar una clase con fin igual o anterior al inicio. | Aviso «La hora de fin tiene que ser posterior a la de inicio» y el formulario conserva lo escrito. | OK |
| PH-05 | Cargar una clase sin elegir ningún día. | Aviso «Elegí al menos un día de la semana» y el formulario conserva lo escrito. | OK |
| PH-06 | Cargar Física lunes, miércoles y viernes 14:00–16:00. | Tres bloques en la grilla; la lista muestra una sola clase «Lunes, Miércoles y Viernes». | OK |
| PH-07 | Editar la clase de PH-06 a martes, miércoles y jueves, sin cambiar el horario. | No se detecta choque consigo misma. Quedan tres días, sin entradas de lunes ni viernes. Aviso con Deshacer por lo que se quitó. | OK |
| PH-08 | Cargar una clase 19:00–21:00 y eliminarla con Deshacer. | La grilla amplía su rango hasta las 21:00; al eliminar se quitan todos sus días y Deshacer los restaura. | OK |

### 4.2 Pomodoro y modo No molestar (RN22 a RN27 · HU17 a HU20)

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PT-01 | En Enfoque, ver el reloj inicial. | Muestra 25:00 y la fase «Estudio». | OK |
| PT-02 | Elegir 15 minutos con el temporizador detenido. | El reloj pasa a 15:00. | OK |
| PT-03 | Iniciar, esperar 10 s, pausar y volver a iniciar. | La pausa conserva el tiempo restante; al reanudar continúa desde ahí. | OK |
| PT-04 | Iniciar y cambiar a otra vista. | Aparece la pastilla con fase y tiempo; al tocarla vuelve a Enfoque. | OK |
| PT-05 | Iniciar, dejar la pestaña en segundo plano 60 s y volver. | El reloj refleja el tiempo real transcurrido. | OK |
| PT-06 | Dejar correr un bloque hasta 00:00 (usar 15 min o ajustar el reloj para la prueba). | Suena la alarma, la fase pasa a «Descanso» de 05:00 y se muestra el aviso. | OK |
| PT-07 | Dejar terminar el descanso. | Aviso «Terminó el descanso…», el temporizador se detiene en fase de estudio. | OK |
| PT-08 | Con No molestar activo y estudio en marcha, crear una materia; luego pausar. | El aviso de creación no se muestra durante el estudio y aparece al pausar. Al eliminar algo durante el estudio, el aviso con Deshacer sí se muestra. | OK |
| PT-09 | Elegir ruido marrón e iniciar; luego pausar. | Suena durante el estudio y se detiene al pausar. Con «Sin sonido» no suena. | OK |

### 4.3 Sincronización (RN35 a RN40 · HU24 a HU27)

Precondición: dos navegadores o dispositivos (A y B), la app publicada por HTTPS y el proyecto de Supabase configurado.

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PS-01 | En Datos, con `configuracion.js` sin completar o sin Supabase cargado. | La app funciona local y Datos indica que la sincronización no está configurada. | OK |
| PS-02 | Abrir la app desde un archivo local (`file://`) e intentar iniciar sesión. | Aviso de que debe abrirse desde una dirección web. | OK |
| PS-03 | En A, iniciar sesión con un correo y abrir el enlace en el mismo navegador. | Datos muestra «Conectado como…» y registra la última sincronización. | OK |
| PS-04 | En A, crear una tarea; esperar unos segundos; en B iniciar sesión con la misma cuenta. | La tarea aparece en B. | OK |
| PS-05 | Con A y B sin conexión, editar la misma tarea en ambos (B después); reconectar y sincronizar. | Prevalece la edición de B (más reciente) en ambos dispositivos. | OK |
| PS-06 | Eliminar una tarea en A; sincronizar B. | La tarea desaparece de B. | OK |
| PS-07 | Con A sin conexión, eliminar una tarea; en B editarla (después); reconectar. | La tarea reaparece en ambos, porque se editó después del borrado. | OK |
| PS-08 | Cortar la conexión y modificar datos; luego forzar «Sincronizar ahora». | Aviso «No se pudo sincronizar. Tus datos siguen guardados en este dispositivo.»; al volver la conexión se sincroniza sola. | OK |
| PS-09 | Con la sesión de un usuario, intentar leer o escribir en `datos_usuario` filas de otro `usuario_id` (por ejemplo, desde el editor SQL con el rol del usuario o llamando a la API). | La base rechaza o no devuelve filas ajenas (política RLS activa). | OK |

### 4.4 Copias de seguridad (RN31 a RN34 · HU21 a HU23)

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PC-01 | Con datos cargados, exportar la copia. | Se descarga `estudia-copia-AAAA-MM-DD.json` con `aplicacion: "EstudIA"`, `version: 1` y los datos; Datos muestra la fecha de la última copia. | OK |
| PC-02 | Borrar datos, importar la copia de PC-01. | Se pide confirmar indicando cantidades de materias, tareas y exámenes; al aceptar, los datos coinciden con la copia. | OK |
| PC-03 | Importar un archivo que no es JSON. | Mensaje «El archivo no es una copia válida.» y datos sin cambios. | OK |
| PC-04 | Importar un JSON válido de otra aplicación (sin `aplicacion: "EstudIA"`). | Mensaje «El archivo no es una copia de EstudIA.» y datos sin cambios. | OK |
| PC-05 | Importar una copia con colecciones dañadas (un elemento sin `id` de texto). | Mensaje «La copia está dañada o incompleta.» y datos sin cambios. | OK |
| PC-06 | Importar una copia antigua sin la clave `horarios`. | Se acepta y los horarios quedan vacíos. | OK |
| PC-07 | Sin sesión, con datos y sin copia, abrir el Panel diario; luego exportar una copia y recargar. | Primero aparece la nota «Tus datos solo están en este dispositivo» con «Protegerlos»; tras exportar, ya no aparece. | OK |

### 4.5 Cascada y deshacer (RN3, RN30 · HU2, HU15)

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PK-01 | Crear una materia con 3 tareas, 1 examen y 2 clases; eliminarla. | Desaparecen la materia y sus 6 actividades; el aviso informa la cantidad y ofrece Deshacer. | OK |
| PK-02 | Tocar Deshacer antes de 7 segundos. | Vuelven la materia y todas sus actividades. | OK |
| PK-03 | Eliminar una materia sin actividades. | El aviso no menciona actividades asociadas. | OK |
| PK-04 | Eliminar una tarea y dejar pasar más de 7 segundos. | La eliminación queda firme; no hay forma de deshacer. | OK |
| PK-05 | Sin materias, intentar crear una tarea. | La app lleva a Materias y avisa que primero hay que crear una. | OK |

### 4.6 Otras reglas de datos (RN5 a RN15 · HU5 a HU11)

| ID | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| PD-01 | Crear una tarea con fecha 2026-11-23 y repetición «8 semanas». | Se crean 8 tareas separadas 7 días (23/11, 30/11, …) y el aviso lo informa. Editar o eliminar una no afecta a las demás. | OK |
| PD-02 | Abrir la edición de una tarea existente. | No se ofrece el campo de repetición. | OK |
| PD-03 | Con 10 tareas, 4 completadas, abrir el Panel diario. | 40 %, leyenda «4 de 10 completadas, 6 pendientes»; sin tareas muestra 0 %. | OK |
| PD-04 | Crear una tarea con fecha de ayer y otra de hoy, ambas pendientes. | Solo la de ayer se resalta como vencida; al completarla deja de resaltarse. | OK |
| PD-05 | En Tareas, buscar un texto, elegir una materia y ordenar por «Prioridad: alta primero». | Se aplican los filtros en conjunto, con las altas primero y por fecha dentro de cada prioridad; los contadores se actualizan. Cerrar «Completadas» y recargar mantiene el cierre. | OK |
| PD-06 | En Calendario, cargar 5 actividades el mismo día. | Se muestran 3 (exámenes primero) y «+2»; elegir el día lista todas. | OK |

## 5. Registro de defectos

| N° | Caso | Descripción | Corrección | Re-ejecución |
|---|---|---|---|---|
| | | | | |

## 6. Justificación del orden de desarrollo de las tareas

El orden de `docs/tasks.md` sigue las dependencias técnicas y busca detectar los errores más costosos lo antes posible:

1. **Definir antes de construir (T1–T5).** Idea, glosario, reglas de trabajo, especificación y arquitectura fijan el lenguaje y los criterios de aceptación contra los que se prueba después.
2. **Base común primero (T6–T11).** Persistencia, marcas de modificación, formulario genérico, escape de HTML, avisos y deshacer son usados por todos los módulos. Construirlos primero evita retocar cada módulo y permite probarlos una sola vez (PK-04, PC-01).
3. **Datos antes que vistas de resumen (T12–T19 antes de T20–T22).** El panel y el calendario consumen materias, tareas y exámenes; sin esos datos no se pueden probar (PD-03, PD-06).
4. **La eliminación en cascada y los borrados reversibles temprano (T11, T13).** Las lápidas son la base de la sincronización; probarlas antes de tener nube (PK-01, PK-02) reduce el riesgo de errores difíciles de diagnosticar después.
5. **Horario y Enfoque como módulos independientes (T23–T32).** No dependen entre sí, por lo que sus pruebas (PH y PT) se ejecutan por separado. En horario, primero la validación, luego la detección y después la repetición, porque cada capa agrega complejidad sobre la anterior.
6. **Copias antes que sincronización (T33–T35 antes de T36–T39).** Importar y restaurar ejercitan el esquema de datos y las lápidas sin red. Si fallan, el problema está en los datos y no en la nube.
7. **Sincronización al final de la construcción (T36–T39).** Es el módulo más complejo y el más difícil de probar; se construye cuando las piezas de las que depende ya están verificadas, y se prueba con dos dispositivos (PS).
8. **Verificación y cierre (T40–T47).** Las pruebas se agrupan por módulo, el informe consolida los resultados y el README se completa con el enlace público ya disponible.

## 7. Conclusión

44 Casos probados:
    - Aprobados: 44
    - Correcciones: ninguna.