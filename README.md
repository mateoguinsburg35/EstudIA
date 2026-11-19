# EstudIA

**Tu organizador académico: todo tu estudio, en un solo lugar.**

EstudIA es una aplicación web para estudiantes que reúne **materias, tareas, exámenes y horarios de cursada** en un panel simple. Te ayuda a saber qué hacer hoy, a no olvidarte ninguna entrega y a estudiar con foco. Funciona en el celular y en la computadora, **sin conexión**, y si querés, sincroniza tus datos entre ambos.

## 🔗 Link público

**https://mateoguinsburg35.github.io/EstudIA/**

## Qué podés hacer

| Función | Descripción |
|---|---|
| **Materias** | Creá cada materia con su color y mirá lo que tenés pendiente en ella. |
| **Tareas** | Cargá tareas y trabajos prácticos con prioridad, fecha, descripción y enlaces. Repetí una tarea semanalmente hasta 16 semanas. |
| **Exámenes** | Anotá cada evaluación y distinguí próximos de pasados. |
| **Calendario** | Tu mes completo con entregas y exámenes, día por día. |
| **Horario** | Armá tu semana de cursada, cargá clases en varios días a la vez y recibí un aviso si dos clases se superponen. |
| **Panel diario** | Qué tenés hoy, tu porcentaje de progreso y lo próximo. |
| **Enfoque** | Pomodoro con modo No molestar y sonido de fondo (ruido blanco o marrón). |
| **Datos** | Copia de seguridad en archivo e inicio de sesión para sincronizar. |
| **Búsqueda y filtros** | Buscá por texto, filtrá por materia y ordená por prioridad. |

Además: deshacer al eliminar, tema claro/oscuro automático y diseño adaptable a celulares.

## Cómo usarla

1. Entrá al link público (o abrí la app desde un servidor, ver más abajo).
2. En **Materias**, creá al menos una materia: es necesaria para cargar tareas, exámenes y clases.
3. Cargá tus **tareas**, **exámenes** y **horario**.
4. Mirá el **Panel diario** para ver qué tenés hoy.
5. Usá **Enfoque** para estudiar en bloques.
6. En **Datos**, exportá una copia de seguridad o iniciá sesión para sincronizar.

### Guardar tus datos

- Los datos quedan **en tu dispositivo**. Si borrás los datos del navegador, se pierden.
- Para protegerlos: exportá una copia en **Datos → Exportar copia**, o iniciá sesión para sincronizar.
- Para pasarlos a otro dispositivo: importá la copia o iniciá sesión con el mismo correo en ambos.

### Iniciar sesión y sincronizar

1. En **Datos → Iniciar sesión**, escribí tu correo.
2. Abrí el enlace que te llega **en el mismo navegador**.
3. Desde ese momento los cambios se sincronizan solos. También podés usar «Sincronizar ahora».

## Ejecutar en tu computadora

No requiere instalación ni compilación. Abrí una terminal en la carpeta del proyecto y levantá un servidor estático:

```bash
python -m http.server 8000
```

Después abrí `http://localhost:8000`. Podés abrir `index.html` directamente desde el archivo, pero **el inicio de sesión no funciona desde `file://`**.

## Configurar la sincronización (opcional)

1. Creá un proyecto en [Supabase](https://supabase.com).
2. Creá la tabla y las políticas de seguridad (el SQL está en `docs/plan.md`, sección 6).
3. En *Authentication → URL Configuration*, agregá la URL de tu despliegue.
4. Completá `configuracion.js` con la URL del proyecto y la **clave publicable**.

> ⚠️ Usá solamente la clave publicable. Nunca subas al repositorio una clave de servicio (`service_role`). La seguridad de los datos depende de las políticas RLS de la tabla.

## Tecnología

HTML5 · CSS3 · JavaScript vainilla (sin frameworks ni compilación) · `localStorage` · Web Audio API · Supabase (opcional) · GitHub Pages.

## Estructura del repositorio

```
/
├── index.html            Estructura y orden de carga
├── estilos.css           Estilos y tema claro/oscuro
├── app.js                Estado, vistas, tareas, exámenes, materias, calendario, panel
├── horario.js            Horario semanal y superposiciones
├── filtros.js            Búsqueda, filtros y orden
├── enfoque.js            Pomodoro, No molestar y sonido
├── copias.js             Copias de seguridad
├── sincronizacion.js     Sincronización con Supabase
├── presentacion.js       Página de bienvenida
├── configuracion.js      Datos públicos de Supabase
├── AGENTS.md             Reglamento de trabajo
├── README.md             Este archivo
├── img/
|    └── logo.png
└── docs/
    ├── idea.md               Idea, usuarios y alcance
    ├── spec.md               Especificación: reglas de negocio e historias de usuario
    ├── plan.md               Arquitectura y modelo de datos
    ├── tasks.md              Tareas ordenadas por dependencias
    ├── decisiones.md         Decisiones de diseño
    ├── glosario.md           Términos del dominio
    ├── manual-usuario.md     Manual de usuario paso a paso
    ├── preguntas-abiertas.md Dudas y su resolución
    └── informe-pruebas.md    Plan y registro de pruebas
```

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/manual-usuario.md`](docs/manual-usuario.md) | Manual de usuario: cómo usar cada sección de la app. |
| [`docs/idea.md`](docs/idea.md) | Problema, propuesta de valor, usuarios y alcance. |
| [`docs/spec.md`](docs/spec.md) | Reglas de negocio (RN) e historias de usuario (HU) con criterios de aceptación. |
| [`docs/plan.md`](docs/plan.md) | Arquitectura técnica, modelo de datos y enfoque offline-first. |
| [`docs/tasks.md`](docs/tasks.md) | Tareas ordenadas por dependencias. |
| [`docs/decisiones.md`](docs/decisiones.md) | Decisiones técnicas y de negocio, y límites aceptados. |
| [`docs/glosario.md`](docs/glosario.md) | Definiciones del dominio. |
| [`docs/preguntas-abiertas.md`](docs/preguntas-abiertas.md) | Dudas surgidas y cómo se resolvieron. |
| [`docs/informe-pruebas.md`](docs/informe-pruebas.md) | Pruebas funcionales y justificación del orden de desarrollo. |
| [`AGENTS.md`](AGENTS.md) | Reglamento de trabajo, stack y fuente de verdad. |

## Reglas de negocio destacadas

- **Superposición horaria:** al cargar una clase se detectan choques con otras del mismo día, y se puede guardar igual tras confirmarlo.
- **Tareas semanales recurrentes:** se crean tareas independientes separadas 7 días.
- **Progreso:** porcentaje de tareas completadas, global y por materia.
- **Offline-first:** todo funciona sin conexión; al sincronizar, gana la modificación más reciente de cada elemento.
- **Pomodoro exacto:** el reloj se calcula contra un instante de fin, por lo que no se desvía con la pestaña en segundo plano.

## Autoría

Proyecto final del bootcamp.

- Autor: Mateo Guinsburg
- Bootcamp: Generación T
- Año: 2026