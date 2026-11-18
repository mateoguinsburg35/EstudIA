# Especificación de EstudIA

> Fuente de verdad funcional del proyecto. Todo lo descrito acá corresponde al comportamiento implementado en el código (`app.js`, `horario.js`, `filtros.js`, `enfoque.js`, `copias.js`, `sincronizacion.js`, `presentacion.js`, `estilos.css`).

## 1. Objetivo

EstudIA es una aplicación web de una sola página (SPA) que reúne en un panel simple las **materias, tareas, exámenes y horarios de cursada** de un estudiante, para que sepa qué tiene que hacer hoy, no se olvide de ninguna entrega y pueda estudiar con foco (Pomodoro). Funciona **sin conexión** (offline-first) y, opcionalmente, **sincroniza** los datos entre celular y computadora.

## 2. Usuarios y roles

| Rol | Descripción | Permisos |
|---|---|---|
| **Estudiante (anónimo/local)** | Usa la app sin cuenta. Sus datos viven solo en el navegador del dispositivo. | Todas las funciones, salvo la sincronización. Puede exportar/importar copias. |
| **Estudiante (con sesión)** | Inició sesión por enlace al correo. | Lo anterior, más sincronización automática entre dispositivos. Solo accede a su propio documento de datos. |

No existen roles administrativos ni datos compartidos entre usuarios.

## 3. Alcance

**Incluido:** gestión de materias, tareas (con repetición semanal), exámenes, calendario mensual, horario semanal con detección de superposiciones, panel diario con progreso, búsqueda/filtros/orden por prioridad, temporizador Pomodoro con modo No molestar y sonido de fondo, copias de seguridad en archivo JSON, sincronización con Supabase, presentación de la app, tema claro/oscuro automático y diseño adaptable a celular.

**Fuera de alcance:** edición colaborativa, notificaciones push, calificaciones/notas, recordatorios fuera de la app, importación desde otros calendarios, roles docentes, modo multiusuario en un mismo dispositivo.

## 4. Modelo de datos (resumen)

```
datos = {
  materias:  [{ id, nombre, color, modificado }],
  tareas:    [{ id, titulo, tipo, materiaId, fecha, prioridad, descripcion?, completada, modificado }],
  examenes:  [{ id, titulo, materiaId, fecha, prioridad, descripcion?, modificado }],
  horarios:  [{ id, materiaId, dia(0=lunes..6=domingo), inicio, fin, grupo?, modificado }],
  eliminados: { [id]: marcaDeTiempo }   // lápidas
}
```

Fechas en formato ISO `AAAA-MM-DD`; horas en `HH:MM`; `modificado` y lápidas en milisegundos desde epoch.

## 5. Reglas de negocio

### Materias

- **RN1 – Datos de una materia.** Una materia requiere un nombre (texto no vacío, sin espacios en los extremos, máximo 80 caracteres) y un color. El color inicial se propone rotando una paleta de 8 colores según la cantidad de materias existentes.
- **RN2 – Materia previa obligatoria.** No se puede crear una tarea, un examen ni una clase si no existe al menos una materia. Si se intenta, la app lleva a la vista Materias y avisa: «Primero creá una materia para poder asociarle actividades.»
- **RN3 – Eliminación en cascada.** Al eliminar una materia se eliminan también todas sus tareas, exámenes y clases. El aviso indica cuántas actividades asociadas se eliminaron y ofrece Deshacer (ver RN30).

### Tareas

- **RN4 – Datos de una tarea.** Una tarea tiene título (máx. 80), tipo (`Tarea` o `Trabajo práctico`), materia, fecha de entrega, prioridad (`alta`, `media`, `baja`; por defecto `media`) y descripción opcional (máx. 1500 caracteres; los enlaces `http(s)` se muestran como vínculos). Se crea siempre como no completada.
- **RN5 – Tareas semanales recurrentes.** Al **crear** una tarea se puede elegir repetición: *no se repite*, *4*, *8* o *16 semanas*. Se crean N tareas **independientes**, la primera en la fecha elegida y las siguientes a +7, +14, … días, con los mismos datos y todas pendientes. Al **editar** una tarea el campo de repetición no se ofrece y el cambio afecta solo a esa tarea. Si N > 1 se avisa «Se crearon N tareas semanales».
- **RN6 – Estados y orden.** Las tareas se dividen en *Pendientes* y *Completadas*. Dentro de cada grupo se ordenan por fecha ascendente y, a igual fecha, por prioridad (alta → media → baja).
- **RN7 – Tarea vencida.** Una tarea **pendiente** cuya fecha es anterior a hoy se resalta como vencida. Una tarea completada nunca se resalta. Las fechas se muestran con texto relativo (hoy, mañana, ayer, en N días, hace N días).

### Exámenes

- **RN8 – Exámenes próximos y pasados.** Un examen tiene título, materia, fecha, prioridad (por defecto `alta`) y descripción opcional. Es *próximo* si su fecha es hoy o posterior (orden ascendente) y *pasado* si es anterior a hoy (el más reciente primero). Los exámenes no tienen estado «completado» y no cuentan para el progreso.

### Búsqueda, filtros y orden

- **RN9 – Filtros combinados.** En Tareas y Exámenes la búsqueda por texto (sin distinguir mayúsculas; sobre título, descripción y nombre de la materia) y el filtro por materia se combinan con **Y**. El orden puede ser por fecha (por defecto) o por prioridad *alta primero* / *baja primero*; dentro de cada prioridad se conserva el orden por fecha (descendente en Exámenes pasados). Cada sección muestra un contador con los resultados visibles. Los filtros de Tareas y de Exámenes son independientes. Si la materia filtrada fue eliminada, el filtro vuelve a «Todas las materias».
- **RN10 – Secciones desplegables persistentes.** Las secciones *Pendientes*, *Completadas*, *Próximos* y *Pasados* se pueden abrir y cerrar. Por defecto están abiertas Pendientes y Próximos. La elección se recuerda **por dispositivo** y no se sincroniza.

### Progreso y panel diario

- **RN11 – Progreso global.** `porcentaje = redondeo(tareas completadas / total de tareas × 100)`; si no hay tareas, el porcentaje es 0 y el titular indica «Todavía no cargaste tareas». Solo cuentan las tareas (no exámenes ni clases).
- **RN12 – Progreso por materia.** Para cada materia con al menos una tarea se muestra una barra con `completadas/total`. Las materias sin tareas no aparecen.
- **RN13 – Panel diario.** «Actividades de hoy» reúne, en este orden: las clases del día de la semana actual, los exámenes con fecha de hoy y las tareas con fecha de hoy (completadas o no). Se listan además hasta 6 tareas pendientes y hasta 5 exámenes próximos.
- **RN14 – Detalle de materia.** Al tocar una materia se despliega su detalle con sus tareas pendientes y sus exámenes próximos. Un nuevo toque sobre la misma materia, o sobre la cruz, lo cierra. Solo hay un detalle abierto a la vez.

### Calendario

- **RN15 – Calendario mensual.** La semana empieza el lunes. Cada día muestra hasta 3 actividades (los exámenes primero) y «+N» si hay más; los exámenes se distinguen de las tareas y las tareas completadas se atenúan. Al elegir un día se listan todas sus actividades y los formularios nuevos proponen esa fecha.

### Horario de cursada

- **RN16 – Validación de una clase.** Una clase requiere materia, **al menos un día** de la semana (lunes a domingo), hora de inicio y hora de fin, y la hora de fin debe ser **posterior** a la de inicio. Si no se cumple, se avisa y el formulario se vuelve a abrir con los valores ingresados.
- **RN17 – Detección de superposiciones.** Dos clases se superponen si son del **mismo día** y `inicio_A < fin_B` y `inicio_B < fin_A`; las clases consecutivas (una termina cuando la otra empieza) **no** se superponen. Al guardar se revisa cada día elegido; si hay choques, se informa día, materia y horario de cada uno y se pide confirmación («Guardar igual»). Al editar, las entradas de la propia clase no cuentan como choque.
- **RN18 – Clases repetidas.** Una clase en varios días se guarda como **una entrada por día**, unidas por un campo opcional `grupo`; el formato de los datos no cambia y la sincronización sigue operando por elemento. En el listado aparece **una sola vez** con sus días en texto («Lunes, Miércoles y Viernes», «Todos los días»).
- **RN19 – Edición de una clase repetida.** Al editar se reutilizan las entradas existentes (se mueven de día si hace falta), se crean las que falten y se eliminan las sobrantes (con Deshacer).
- **RN20 – Eliminación de una clase.** Se eliminan todas las entradas de su grupo, con Deshacer.
- **RN21 – Grilla semanal.** Muestra los siete días con bloques posicionados y dimensionados proporcionalmente al horario. El rango visible es como mínimo de 08:00 a 18:00 y se amplía para incluir cualquier clase fuera de ese rango. El día actual se resalta.

### Modo Enfoque (Pomodoro)

- **RN22 – Ciclo del temporizador.** El bloque de estudio dura 15, 25 (por defecto), 45 o 50 minutos; el descanso dura 5 minutos. Al terminar el estudio comienza el descanso automáticamente; al terminar el descanso el temporizador se detiene y queda listo para un nuevo bloque. Cada fin de fase emite una alarma (tono de 880 Hz, 0,4 s) y una vibración si el dispositivo la admite.
- **RN23 – Reloj basado en marca absoluta.** El tiempo restante se calcula contra un instante de fin previsto y no contando ticks, por lo que se mantiene exacto aunque la pestaña esté en segundo plano. Al pausar se conserva el tiempo restante.
- **RN24 – Ajustes y reinicio.** Cambiar la duración solo reajusta el reloj si el temporizador está detenido y en fase de estudio. *Reiniciar* pausa y vuelve a una fase de estudio completa.
- **RN25 – Pastilla flotante.** Mientras el temporizador está activo y la vista actual no es Enfoque, se muestra una pastilla con la fase y el tiempo restante que lleva de vuelta a Enfoque.
- **RN26 – No molestar.** Con la opción activa (por defecto), durante el estudio los avisos se **retienen**, salvo los que traen un botón Deshacer. Los avisos retenidos se muestran juntos al pausar, al terminar el estudio o al desactivar la opción. Además, el recordatorio de copia de seguridad (RN34) no se muestra en ese modo.
- **RN27 – Sonido de fondo.** Opciones: sin sonido, ruido blanco o ruido marrón, generados en el navegador con la Web Audio API. Suena **solo** mientras el temporizador de estudio está en marcha; se detiene al pausar y durante el descanso. Si el audio no está disponible, la app sigue funcionando.

### Persistencia local

- **RN28 – Almacenamiento local.** Los datos se guardan en `localStorage` bajo la clave `estudia:v1` en cada cambio. Los datos propios del dispositivo (secciones abiertas, última copia, última sincronización) se guardan aparte en `estudia:meta:v1` y **no** se sincronizan. Si el navegador no permite escribir, se avisa que los cambios se perderán al cerrar. La app solicita al navegador almacenamiento persistente.
- **RN29 – Marca de modificación.** Todo elemento lleva `modificado` (ms). Se actualiza en cada creación o edición, incluyendo marcar una tarea como completada y cambiar su prioridad. Al cargar, los elementos sin marca (datos antiguos) reciben la hora actual.
- **RN30 – Eliminación con deshacer y lápidas.** Todo borrado es inmediato y registra una *lápida* `eliminados[id] = momento`. El aviso ofrece Deshacer durante 7 segundos; al deshacer se quita la lápida y el elemento vuelve con `modificado` actualizado.

### Copias de seguridad

- **RN31 – Exportación.** Genera `estudia-copia-AAAA-MM-DD.json` con `{ aplicacion: "EstudIA", version: 1, exportado, datos }` y registra la fecha de la última copia.
- **RN32 – Validación de importación.** Se rechaza, sin modificar datos, un archivo que no sea JSON válido, que no declare `aplicacion: "EstudIA"` o cuyas colecciones no sean listas de elementos con `id` de texto. Las copias antiguas sin `horarios` se aceptan (se asumen vacíos).
- **RN33 – Restauración.** Antes de reemplazar los datos se muestra una confirmación destructiva con la cantidad de materias, tareas y exámenes de la copia. Al confirmar, los elementos de la copia reemplazan a los actuales (con `modificado` actual) y los elementos actuales que **no** están en la copia se marcan como eliminados, para que la sincronización no los traiga de vuelta.
- **RN34 – Recordatorio de respaldo.** En el Panel diario se muestra una nota «Tus datos solo están en este dispositivo» cuando hay datos, no hay sesión iniciada, no se exportó una copia en los últimos 14 días (o nunca) y no está activo No molestar.

### Sincronización (offline-first)

- **RN35 – Disponibilidad.** La sincronización está disponible solo si la librería de Supabase está cargada y `configuracion.js` contiene una URL `https://` real. Si no, la app funciona 100 % local y la vista Datos lo indica.
- **RN36 – Autenticación.** El acceso es por enlace enviado al correo (OTP), que debe abrirse en el mismo navegador. No funciona abriendo la app desde un archivo local (`file://`); en ese caso se avisa que debe abrirse desde una dirección web.
- **RN37 – Modelo remoto.** Un único documento JSON por usuario (tabla `datos_usuario`: `usuario_id`, `contenido`, `actualizado`). Los datos locales son la fuente principal.
- **RN38 – Fusión por marcas de tiempo.** Para cada `id` prevalece la versión con `modificado` mayor; en **empate prevalece la local**. Las lápidas de ambos lados se unen conservando la mayor. Un elemento con lápida solo reaparece si su `modificado` es posterior a la lápida (edición posterior al borrado).
- **RN39 – Ciclo y disparadores.** Cada sincronización: (1) lee el documento remoto, (2) fusiona, (3) si el resultado difiere guarda localmente y vuelve a dibujar, (4) sube el resultado. Se dispara al iniciar sesión, al volver a la app (cambio de visibilidad), al recuperar conexión, manualmente, y 1,5 s después del último cambio local (con *debounce*). Nunca corren dos a la vez: si llega otro pedido mientras una está en curso, se encola y se reprograma al terminar.
- **RN40 – Tolerancia a fallos.** Si la sincronización falla (sin red, error del servidor) se informa «No se pudo sincronizar. Tus datos siguen guardados en este dispositivo.» y no se pierde ningún dato local; se reintenta en el próximo disparador.

### Transversales

- **RN41 – Seguridad de contenido.** Todo texto ingresado por la persona se escapa antes de mostrarse en pantalla; los enlaces en descripciones solo se activan para `http(s)`, abren en pestaña nueva con `rel="noopener noreferrer"` y se abrevian a 45 caracteres.
- **RN42 – Secretos.** El código solo contiene la URL del proyecto y la **clave pública (publishable)** de Supabase, aislada en `configuracion.js`. Nunca debe incluirse una clave de servicio (`service_role`). La confidencialidad entre usuarios se garantiza con políticas de seguridad por fila (RLS) en `datos_usuario`, de modo que cada usuario solo lea y escriba la fila cuyo `usuario_id` coincide con su identidad autenticada.
- **RN43 – Presentación inicial.** Al abrir la app se muestra la presentación; se vuelve a ella desde el logo/nombre y se entra a la aplicación desde el botón «Ingresar a la aplicación» o desde cualquiera de las tarjetas de funciones.
- **RN44 – Tema y adaptación.** El tema claro/oscuro sigue la preferencia del sistema. En pantallas de hasta 760 px el menú pasa a una barra inferior y los controles se reordenan. Se respeta la preferencia de movimiento reducido y las zonas seguras de pantallas con muescas.

## 6. Historias de usuario

### Materias

**HU1 – Crear y editar una materia** *(RN1, RN2)*
Como estudiante quiero registrar mis materias con un color propio para identificarlas en toda la app.
- **Dado** que estoy en la vista Materias, **cuando** completo el nombre y confirmo, **entonces** la materia aparece en la lista con su color y sus contadores en 0 tareas y 0 exámenes.
- **Dado** que dejo el nombre vacío, **cuando** intento guardar, **entonces** el formulario no se envía.
- **Dado** que no tengo materias, **cuando** intento crear una tarea, un examen o una clase, **entonces** la app me lleva a Materias y me avisa que primero debo crear una.

**HU2 – Eliminar una materia y deshacer** *(RN3, RN30)*
- **Dado** una materia con 3 tareas, 1 examen y 2 clases, **cuando** la elimino, **entonces** desaparecen la materia y sus 6 actividades y el aviso lo informa con un botón Deshacer.
- **Dado** que acabo de eliminarla, **cuando** toco Deshacer antes de 7 segundos, **entonces** la materia y todo lo asociado vuelven a estar disponibles.

**HU3 – Ver el detalle de una materia** *(RN14)*
- **Dado** que estoy en Materias, **cuando** toco una materia, **entonces** se despliega su detalle con tareas pendientes y próximos exámenes.
- **Dado** que el detalle está abierto, **cuando** toco la cruz o la misma materia, **entonces** se cierra.

### Tareas y exámenes

**HU4 – Registrar una tarea** *(RN4, RN2)*
- **Dado** que tengo al menos una materia, **cuando** cargo título, tipo, materia, fecha, prioridad y una descripción con un enlace, **entonces** la tarea queda en Pendientes y el enlace se muestra como vínculo.

**HU5 – Crear tareas semanales recurrentes** *(RN5)*
- **Dado** que creo una tarea con fecha 2026-11-23 y repetición «8 veces», **cuando** guardo, **entonces** se crean 8 tareas independientes con fechas cada 7 días (2026-11-23, 2026-11-30, …) y se me avisa «Se crearon 8 tareas semanales».
- **Dado** una de esas tareas, **cuando** la edito o la elimino, **entonces** las demás no cambian.
- **Dado** que edito una tarea existente, **cuando** abro el formulario, **entonces** no se ofrece el campo de repetición.

**HU6 – Completar tareas y reconocer las vencidas** *(RN6, RN7)*
- **Dado** una tarea pendiente con fecha de ayer, **cuando** veo la lista, **entonces** su fecha aparece resaltada como vencida.
- **Cuando** la marco como completada, **entonces** pasa a Completadas y deja de resaltarse.

**HU7 – Cambiar la prioridad rápidamente** *(RN4, RN29)*
- **Dado** una tarea o examen en la lista, **cuando** cambio su selector de prioridad, **entonces** se actualiza su color y su orden en la lista y se registra una nueva marca de modificación.

**HU8 – Registrar exámenes y distinguir próximos de pasados** *(RN8)*
- **Dado** un examen con fecha de hoy, **entonces** figura en Próximos; **dado** uno de ayer, figura en Pasados, el más reciente primero.

**HU9 – Buscar, filtrar y ordenar** *(RN9, RN10)*
- **Dado** que escribo «parcial» y elijo la materia «Física», **cuando** se aplican los filtros, **entonces** solo veo elementos de Física cuyo título, descripción o materia contienen «parcial», y los contadores se actualizan.
- **Dado** que elijo «Prioridad: alta primero», **entonces** las altas se muestran primero y, dentro de cada prioridad, por fecha.
- **Dado** que cierro la sección Completadas y recargo la app, **entonces** sigue cerrada.

### Panel y calendario

**HU10 – Ver mi progreso y mi día** *(RN11, RN12, RN13)*
- **Dado** 10 tareas de las cuales 4 están completadas, **cuando** abro el Panel diario, **entonces** el titular dice «Completaste el 40 % de tus tareas», la barra marca 40 y la leyenda «4 de 10 completadas, 6 pendientes».
- **Dado** que no tengo tareas, **entonces** se muestra «Todavía no cargaste tareas» y 0 %.
- **Dado** que hoy es martes y tengo una clase de martes, un examen hoy y una tarea hoy, **entonces** las tres aparecen en «Actividades de hoy».
- **Dado** una materia sin tareas, **entonces** no aparece en el progreso por materia.

**HU11 – Ver el mes en el calendario** *(RN15)*
- **Dado** un día con 5 actividades, **cuando** veo el mes, **entonces** se muestran 3 (exámenes primero) y «+2».
- **Cuando** elijo un día y toco «Nueva tarea», **entonces** el formulario propone esa fecha.

### Horario

**HU12 – Cargar una clase en varios días** *(RN16, RN18)*
- **Dado** que elijo lunes, miércoles y viernes de 08:00 a 12:00, **cuando** guardo, **entonces** se crean tres entradas y la lista muestra una sola clase «Lunes, Miércoles y Viernes».
- **Dado** que no elijo ningún día, o que el fin es igual o anterior al inicio, **entonces** se me avisa y el formulario conserva lo que escribí.

**HU13 – Detectar superposiciones** *(RN17)*
- **Dado** una clase el lunes de 08:00 a 10:00, **cuando** cargo otra el lunes de 09:00 a 11:00, **entonces** se me informa el choque (día, materia y horario) y puedo cancelar o «Guardar igual».
- **Cuando** cargo una el lunes de 10:00 a 12:00, **entonces** se guarda sin aviso.
- **Dado** que edito una clase repetida sin cambiar su horario, **entonces** no se detecta choque con ella misma.

**HU14 – Editar una clase repetida** *(RN19)*
- **Dado** una clase de lunes y miércoles, **cuando** la edito a martes, miércoles y jueves, **entonces** la entrada del lunes se reutiliza para otro día, se crea la faltante y no quedan entradas sobrantes; si sobraran, se eliminan con Deshacer.

**HU15 – Eliminar una clase** *(RN20, RN30)*
- **Cuando** elimino una clase repetida, **entonces** se quitan todos sus días y puedo deshacerlo.

**HU16 – Ver mi semana** *(RN21)*
- **Dado** una clase a las 19:00–21:00, **entonces** la grilla amplía su rango hasta las 21:00 y el día actual aparece resaltado.

### Enfoque

**HU17 – Estudiar con Pomodoro** *(RN22, RN23, RN24)*
- **Dado** un bloque de 25 minutos, **cuando** toco Iniciar, **entonces** el reloj descuenta y al llegar a 00:00 suena la alarma y comienza un descanso de 5 minutos.
- **Cuando** toco Pausar, **entonces** se conserva el tiempo restante y, al reanudar, continúa desde ahí.
- **Cuando** cambio de pestaña por varios minutos y vuelvo, **entonces** el reloj refleja el tiempo real transcurrido.
- **Cuando** toco Reiniciar, **entonces** vuelve a estudio con la duración completa.

**HU18 – Navegar sin perder el temporizador** *(RN25)*
- **Dado** un temporizador activo, **cuando** voy a otra vista, **entonces** veo una pastilla con fase y tiempo que me devuelve a Enfoque.

**HU19 – No ser interrumpido mientras estudio** *(RN26)*
- **Dado** No molestar activo y estudio en marcha, **cuando** ocurre un aviso (por ejemplo, «Se creó…»), **entonces** no se muestra; **cuando** el estudio termina, **entonces** veo todos los avisos retenidos juntos.
- **Dado** que elimino algo durante el estudio, **entonces** el aviso con Deshacer sí se muestra.

**HU20 – Escuchar un sonido de concentración** *(RN27)*
- **Dado** que elijo ruido marrón, **cuando** inicio el estudio, **entonces** suena; **cuando** pauso o empieza el descanso, **entonces** se detiene.

### Copias y sincronización

**HU21 – Exportar una copia** *(RN31)*
- **Cuando** toco «Exportar copia», **entonces** se descarga `estudia-copia-AAAA-MM-DD.json` y la vista Datos muestra la fecha de la última copia.

**HU22 – Restaurar una copia** *(RN32, RN33)*
- **Dado** un archivo válido, **cuando** lo importo, **entonces** se me pide confirmar indicando cuántas materias, tareas y exámenes contiene y, al aceptar, mis datos pasan a ser los de la copia.
- **Dado** un archivo que no es de EstudIA o está dañado, **entonces** se muestra un mensaje de error y mis datos no cambian.
- **Dado** que restauro una copia y tengo sesión, **entonces** lo que no estaba en la copia no reaparece tras sincronizar.

**HU23 – Recordar que respalde mis datos** *(RN34)*
- **Dado** que tengo datos, no tengo sesión y nunca exporté, **cuando** abro el Panel diario, **entonces** veo la nota con el botón «Protegerlos» que me lleva a Datos.
- **Dado** que exporté hace menos de 14 días o inicié sesión, **entonces** la nota no aparece.

**HU24 – Iniciar sesión por correo** *(RN35, RN36)*
- **Dado** que la sincronización está configurada, **cuando** ingreso mi correo, **entonces** recibo un enlace y, al abrirlo en el mismo navegador, quedo conectado y se sincroniza.
- **Dado** que abro la app desde un archivo local, **entonces** se me avisa que debo abrirla desde una dirección web.
- **Dado** que la configuración no está completa, **entonces** la app funciona localmente y Datos explica cómo configurarla.

**HU25 – Tener los mismos datos en celular y computadora** *(RN37, RN39)*
- **Dado** que creo una tarea en el celular, **cuando** pasan unos segundos con conexión, **entonces** se sube al documento remoto y, al abrir la app en la computadora, aparece.

**HU26 – Resolver conflictos entre dispositivos** *(RN38)*
- **Dado** que edito la misma tarea en dos dispositivos sin conexión, **cuando** ambos se sincronizan, **entonces** prevalece la edición más reciente.
- **Dado** que elimino una tarea en un dispositivo, **cuando** el otro sincroniza, **entonces** la tarea desaparece también allí, salvo que allí se haya editado después del borrado.
- **Dado** una modificación con marcas de tiempo idénticas, **entonces** prevalece la versión local.

**HU27 – Usar la app sin conexión** *(RN28, RN40)*
- **Dado** que no tengo internet, **cuando** uso la app, **entonces** todo funciona y los cambios se guardan localmente.
- **Dado** que la sincronización falla, **entonces** veo «No se pudo sincronizar. Tus datos siguen guardados en este dispositivo.» y no pierdo datos; al volver la conexión se sincroniza sola.

### Experiencia

**HU28 – Conocer la app al entrar** *(RN43)*
- **Cuando** abro EstudIA, **entonces** veo la presentación con las seis funciones; al tocar «Ingresar a la aplicación» o una tarjeta, voy a la vista correspondiente; al tocar el logo, vuelvo a la presentación.

**HU29 – Usarla cómodamente en cualquier dispositivo** *(RN44)*
- **Dado** que mi sistema usa tema oscuro, **entonces** la app se muestra en oscuro; **dado** un celular, **entonces** la navegación queda en una barra inferior.

## 7. Casos borde

| # | Caso | Comportamiento |
|---|---|---|
| CB1 | Tarea de hoy o examen de hoy | Una tarea de hoy no es vencida; un examen de hoy es «próximo». |
| CB2 | Dos clases consecutivas (10:00 fin / 10:00 inicio) | No se consideran superpuestas (RN17). |
| CB3 | Clase en los 7 días | Se muestra como «Todos los días». |
| CB4 | Tareas recurrentes que cruzan fin de mes o año | Se calculan sumando 7 días por calendario; no se pierden fechas. |
| CB5 | Eliminar una materia sin actividades | El aviso no menciona actividades asociadas. |
| CB6 | Materia eliminada en otro dispositivo con ítems aún referenciados | Los ítems se muestran como «Sin materia» con color neutro. |
| CB7 | Importar una copia antigua sin `horarios` | Se acepta con horarios vacíos (RN32). |
| CB8 | Importar un archivo con elementos sin `id` de texto | Se rechaza como «dañada o incompleta». |
| CB9 | Pestaña en segundo plano durante el Pomodoro | El reloj usa el instante de fin previsto y se corrige al volver (RN23). |
| CB10 | Cambiar la duración con el temporizador en marcha | No altera el bloque actual; rige para el siguiente (RN24). |
| CB11 | Navegador sin Web Audio o sin vibración | La alarma y el ruido se omiten sin romper la app. |
| CB12 | Almacenamiento local lleno o bloqueado | Aviso de que los cambios no se guardarán (RN28). |
| CB13 | Dos sincronizaciones simultáneas | Se encola una sola pendiente (RN39). |
| CB14 | Sin sesión o sin configuración de Supabase | Funcionamiento 100 % local (RN35). |
| CB15 | Texto con HTML o scripts en título/descripción | Se escapa; no se ejecuta (RN41). |
| CB16 | Aviso mientras No molestar está activo | Se retiene hasta salir del estudio (RN26). |
| CB17 | Deshacer tras haber sincronizado la eliminación | Se quita la lápida local y el elemento vuelve con `modificado` más reciente, por lo que prevalece en la fusión (RN30, RN38). |
| CB18 | Reloj del dispositivo desajustado | La fusión confía en `modificado` de cada dispositivo; un reloj muy adelantado puede ganar conflictos. Se acepta como límite del modelo de «última modificación gana por elemento». |
| CB19 | Restaurar una copia cuyas tareas referencian materias inexistentes | La validación solo exige `id`; esos ítems se muestran como «Sin materia». Se acepta como límite conocido. |

## 8. Pendientes

**Ninguno.** Todas las reglas de negocio e historias de usuario descritas están implementadas y verificadas (ver `docs/informe-pruebas.md`). Las limitaciones CB18 y CB19 están aceptadas y documentadas como decisiones de alcance (ver `docs/decisiones.md`).