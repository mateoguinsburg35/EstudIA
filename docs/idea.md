# Idea de EstudIA

## Resumen

**EstudIA** es una aplicación web para estudiantes que reúne en un solo panel sus **materias, tareas, exámenes y horarios de cursada**. Ayuda a saber qué hacer hoy, a no olvidar ninguna entrega y a estudiar con foco mediante un temporizador Pomodoro. Funciona en el celular y en la computadora, sin instalar nada y **sin necesidad de conexión**; si la persona lo desea, sincroniza sus datos entre dispositivos.

## Problema

Un estudiante maneja información dispersa: fechas de entrega en notas o chats, horarios de cursada en capturas, exámenes en un calendario aparte y consignas en distintos enlaces. Esa dispersión provoca olvidos, superposiciones de horarios sin advertir y dificultad para priorizar. Las herramientas generales (calendarios, listas de tareas) no entienden la estructura académica: materia, tipo de actividad, cursada semanal.

## Propuesta de valor

- **Todo en un lugar:** materias con color propio y, dentro de cada una, sus tareas, trabajos prácticos, exámenes y clases.
- **Saber qué hacer hoy:** un panel diario con las actividades del día, el progreso y lo pendiente.
- **Menos errores de planificación:** avisa cuando una clase nueva se superpone con otra y permite cargar clases repetidas en varios días de una sola vez.
- **Constancia:** tareas semanales recurrentes (hasta 16 semanas, un cuatrimestre) sin cargarlas una por una.
- **Foco:** Pomodoro con modo No molestar y sonido de fondo.
- **Datos propios y seguros:** se guardan en el dispositivo, se pueden respaldar en un archivo y, opcionalmente, sincronizar entre celular y computadora.

## Usuarios

| Usuario | Necesidad |
|---|---|
| Estudiante secundario, terciario o universitario | Organizar cursada, entregas y exámenes. |
| Estudiante que alterna celular y computadora | Tener los mismos datos en ambos, también sin conexión. |

No hay roles administrativos, docentes ni datos compartidos entre personas. Hay dos modos de uso: **local** (sin cuenta) y **con sesión** (sincronizado).

## Alcance

### Incluido

- Gestión de materias, tareas (con repetición semanal), exámenes y clases.
- Calendario mensual y horario semanal con detección de superposiciones.
- Panel diario con progreso global y por materia.
- Búsqueda, filtro por materia y orden por prioridad.
- Pomodoro con No molestar y ruido blanco/marrón.
- Copias de seguridad en archivo JSON.
- Sincronización con Supabase mediante inicio de sesión por correo.
- Presentación de la app, tema claro/oscuro automático y diseño adaptable a celular.

### Fuera de alcance

- Edición colaborativa o datos compartidos entre usuarios.
- Notificaciones push o recordatorios fuera de la app.
- Calificaciones y promedios.
- Importación desde otros calendarios.
- Cuentas docentes o institucionales.

## Tecnología

Aplicación de una sola página (SPA) en HTML5, CSS3 y JavaScript sin frameworks, con almacenamiento local en el navegador y sincronización opcional con Supabase. El detalle está en `docs/plan.md`; la especificación funcional, en `docs/spec.md`.
