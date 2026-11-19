# Glosario de EstudIA

Términos del dominio, en orden alfabético. Los códigos RN remiten a `docs/spec.md`.

| Término | Definición |
|---|---|
| **Bloque horario** | Franja de una clase en la grilla semanal, definida por día, hora de inicio y hora de fin, con el color de su materia (RN21). |
| **Clase** | Encuentro de cursada de una materia en un día y horario fijos. Se repite cada semana (RN16). |
| **Clase repetida** | Clase cargada en varios días de la semana. Se guarda como una entrada por día unidas por un `grupo` y se muestra como una sola (RN18). |
| **Clave publicable** | Clave pública de Supabase incluida en `configuracion.js`. No es un secreto: la seguridad la dan las políticas RLS (RN42). |
| **Copia de seguridad** | Archivo JSON con todos los datos, exportable e importable. Permite respaldar o pasar datos a otro dispositivo (RN31). |
| **Datos del dispositivo (meta)** | Preferencias que no se sincronizan, como secciones abiertas, última copia y última sincronización (RN28). |
| **Deshacer** | Opción disponible 7 segundos tras un borrado para restaurar lo eliminado (RN30). |
| **Examen** | Evaluación de una materia en una fecha, con prioridad. Es *próximo* si su fecha es hoy o posterior y *pasado* si es anterior (RN8). |
| **Fase** | Etapa del Pomodoro: *estudio* o *descanso* (RN22). |
| **Fusión por marcas de tiempo** | Algoritmo que une los datos locales y remotos: por cada elemento prevalece el de `modificado` mayor, con prioridad local en empate, y respeta las lápidas (RN38). |
| **Lápida** | Registro `id → momento` de un elemento eliminado; evita que la sincronización lo reviva (RN30). |
| **Marca de modificación (`modificado`)** | Instante, en milisegundos, de la última creación o edición de un elemento (RN29). |
| **Materia** | Asignatura que cursa el estudiante, con nombre y color. Agrupa tareas, exámenes y clases (RN1). |
| **No molestar** | Opción del modo Enfoque que retiene los avisos durante el estudio, salvo los que traen Deshacer (RN26). |
| **Offline-first** | Principio por el cual la app funciona con los datos locales sin conexión y sincroniza cuando puede; los datos locales son la fuente principal (RN28, RN37). |
| **Panel diario** | Vista de inicio con el progreso, las actividades de hoy, tareas pendientes y próximos exámenes (RN13). |
| **Pastilla** | Indicador flotante con la fase y el tiempo restante del Pomodoro, visible fuera de la vista Enfoque (RN25). |
| **Pomodoro** | Técnica de estudio en bloques de concentración seguidos de descansos. En EstudIA: bloque de 15, 25, 45 o 50 minutos y descanso de 5 (RN22). |
| **Prioridad** | Nivel *alta*, *media* o *baja* de una tarea o examen; ordena y colorea las listas (RN4, RN9). |
| **Progreso** | Porcentaje de tareas completadas sobre el total, global y por materia. No incluye exámenes ni clases (RN11, RN12). |
| **RLS (seguridad por fila)** | Política de la base de datos por la cual cada usuario solo accede a su propia fila (RN42). |
| **Sincronización** | Proceso que lee los datos remotos, los fusiona con los locales y sube el resultado a Supabase (RN39). |
| **Superposición** | Situación en que dos clases del mismo día comparten algún tramo horario. Las consecutivas no se superponen (RN17). |
| **Tarea** | Actividad a entregar con título, tipo, materia, fecha, prioridad y estado completada o pendiente (RN4). |
| **Tarea semanal recurrente** | Conjunto de tareas independientes creadas a la vez, separadas 7 días entre sí (RN5). |
| **Tipo de tarea** | Clasificación de una tarea: *Tarea* o *Trabajo práctico* (RN4). |
| **Vencida** | Tarea pendiente cuya fecha de entrega es anterior a hoy (RN7). |
