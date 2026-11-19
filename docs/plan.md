# Plan técnico de EstudIA

Describe cómo está construida la aplicación. La especificación funcional está en `docs/spec.md` y las decisiones en `docs/decisiones.md`.

## 1. Visión general

EstudIA es una SPA estática: no tiene servidor propio. Toda la lógica corre en el navegador; el único servicio externo es Supabase, usado de forma opcional para autenticación y sincronización.

```
┌────────────────────────── Navegador ──────────────────────────┐
│  index.html ── carga scripts ──► módulos JS                   │
│                                                               │
│  app.js (estado, vistas, formularios)                         │
│     ├─ horario.js     ├─ filtros.js      ├─ enfoque.js        │
│     ├─ copias.js      ├─ presentacion.js                      │
│     └─ sincronizacion.js ──────────────┐                      │
│                                        │                      │
│  localStorage                          │                      │
│   ├─ estudia:v1       (datos)          │                      │
│   └─ estudia:meta:v1  (solo dispositivo)                      │
└────────────────────────────────────────┼──────────────────────┘
                                         ▼  (opcional, con sesión)
                              Supabase: Auth + tabla datos_usuario
```

## 2. Módulos y responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura (menú, contenedor, diálogo, aviso, pastilla) y orden de carga. |
| `estilos.css` | Variables de color, tema claro/oscuro, diseño adaptable, componentes. |
| `app.js` | Estado `datos`, persistencia local, enrutamiento de vistas y `render()`, delegación de eventos, formularios modales, avisos y deshacer, utilidades de fecha y escape, materias, tareas, exámenes, calendario y panel diario. |
| `horario.js` | Clases, grilla semanal, superposiciones, clases repetidas por grupo. |
| `filtros.js` | Búsqueda, filtro por materia, orden por prioridad, secciones desplegables persistentes. |
| `enfoque.js` | Temporizador Pomodoro, No molestar, alarma y ruido de fondo. |
| `copias.js` | Exportación, validación e importación de copias; recordatorio de respaldo. |
| `sincronizacion.js` | Cliente de Supabase, sesión, fusión por marcas de tiempo, ciclo de sincronización. |
| `presentacion.js` | Pantalla de bienvenida. |
| `configuracion.js` | URL y clave publicable de Supabase. |

**Orden de carga:** `configuracion.js` → Supabase → `sincronizacion.js` → `copias.js` → `horario.js` → `filtros.js` → `presentacion.js` → `enfoque.js` → `app.js`. Los módulos comparten el ámbito global (scripts clásicos); `app.js` va al final porque inicia la app cuando todas las funciones que invoca ya existen.

## 3. Flujo de la interfaz

1. Un evento de clic o cambio llega al manejador delegado, que lee `data-accion` y ejecuta la función registrada.
2. La función modifica `datos`, normalmente con `estampar` (marca de modificación) y `guardarYRenderizar`.
3. `guardarYRenderizar` guarda en `localStorage`, programa la sincronización (si hay sesión) y llama a `render()`.
4. `render()` construye el HTML de la vista actual con funciones que devuelven texto, y lo inserta en `#contenido`.

Los filtros son una excepción deliberada: actualizan solo `#resultados` para no perder el foco del cuadro de búsqueda.

## 4. Modelo de datos

```
datos = {
  materias:  [{ id, nombre, color, modificado }],
  tareas:    [{ id, titulo, tipo, materiaId, fecha, prioridad, descripcion?, completada, modificado }],
  examenes:  [{ id, titulo, materiaId, fecha, prioridad, descripcion?, modificado }],
  horarios:  [{ id, materiaId, dia, inicio, fin, grupo?, modificado }],
  eliminados: { [id]: milisegundos }
}
```

| Campo | Formato | Notas |
|---|---|---|
| `id` | texto | Generado en el cliente. |
| `fecha` | `AAAA-MM-DD` | Comparable como texto. |
| `inicio`, `fin` | `HH:MM` | `fin` > `inicio` (RN16). |
| `dia` | 0 a 6 | 0 = lunes. |
| `prioridad` | `alta` \| `media` \| `baja` | Peso numérico para ordenar. |
| `tipo` (tarea) | `Tarea` \| `Trabajo práctico` | |
| `grupo` | texto opcional | Une las entradas de una clase repetida (RN18). |
| `modificado` | milisegundos | Base de la fusión (RN29, RN38). |
| `eliminados` | `id → milisegundos` | Lápidas (RN30). |

**Por qué un modelo plano y descentralizado.** Cada elemento es autónomo y se relaciona con su materia solo por `materiaId`. Así (a) cada elemento se fusiona por separado en la sincronización; (b) una edición en un dispositivo no pisa otras ediciones en otro; (c) las vistas por fecha (calendario, panel) consultan directamente las colecciones sin recorrer estructuras anidadas; (d) el formato de la copia de seguridad es idéntico al de los datos.

## 5. Almacenamiento local

| Clave | Contenido | ¿Se sincroniza? |
|---|---|---|
| `estudia:v1` | `datos` completo | Sí |
| `estudia:meta:v1` | `secciones` abiertas, `ultimaCopia`, `ultimaSincronizacion` | No |

- Se guarda tras cada cambio; si el navegador rechaza la escritura, se avisa (RN28).
- Al cargar, los elementos sin `modificado` reciben la hora actual (migración de datos antiguos, RN29).
- Se solicita almacenamiento persistente para que el navegador no purgue los datos.

## 6. Offline-first con Supabase

### Justificación

| Requisito | Cómo lo cubre el enfoque |
|---|---|
| Usar la app en el colectivo, sin señal | Los datos locales son la fuente principal; todo funciona sin conexión. |
| Mismos datos en celular y computadora | Sincronización opcional con una cuenta. |
| No perder datos ante fallos | Un fallo de red solo pospone la sincronización; lo local nunca se descarta (RN40). |
| Simplicidad y costo | Sin servidor propio: Supabase (plan gratuito) con un documento JSON por usuario. |
| Sin gestionar contraseñas | Inicio de sesión por enlace al correo. |

**Por qué un documento por usuario:** el volumen es pequeño (decenas a cientos de elementos), cada sincronización es una lectura y una escritura, y no se necesitan consultas del lado del servidor.

### Esquema de referencia en Supabase

```sql
create table datos_usuario (
  usuario_id  uuid primary key references auth.users(id) on delete cascade,
  contenido   jsonb not null,
  actualizado timestamptz not null default now()
);

alter table datos_usuario enable row level security;

create policy "cada usuario accede solo a su fila"
  on datos_usuario for all to authenticated
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);
```

En el panel de Supabase, en *Authentication → URL Configuration*, deben figurar como URL permitidas las de despliegue y de desarrollo, por ejemplo `https://mateoguinsburg35.github.io/EstudIA/`.

### Ciclo de sincronización

```
 cambio local ─► guardar local ─► (debounce 1,5 s) ─┐
 inicio de sesión · volver a la app · online · botón ┤
                                                      ▼
                          ¿hay sincronización en curso? ── sí ─► marcar pendiente
                                       │ no
                                       ▼
                   leer fila remota ─► fusionar(local, remoto)
                                       │
                   ¿cambió? ── sí ─► guardar local y redibujar
                                       ▼
                         subir resultado (upsert) ─► registrar última sincronización
                                       │ error: avisar, conservar lo local
                                       ▼
                         ¿había pendiente? ─ sí ─► reprogramar
```

### Fusión por marcas de tiempo

1. Se unen las lápidas de ambos lados, conservando la mayor por `id`.
2. Para cada colección, se agrupan los elementos por `id`; prevalece el de `modificado` mayor y, en empate, el local.
3. Se descartan los elementos que tienen lápida, salvo que su `modificado` sea posterior a ella.

Propiedades: resultado determinista, idempotente (fusionar dos veces da lo mismo) y conmutativo salvo en el empate, donde manda lo local. Límite aceptado: depende de los relojes de los dispositivos (CB18).

## 7. Dónde vive cada regla de negocio

| RN | Tema | Implementación |
|---|---|---|
| RN1–RN3 | Materias, requisito previo, cascada | `app.js` (formulario de materia, verificación de materias existentes, eliminación de materia) |
| RN4–RN7 | Tareas, recurrencia, orden, vencidas | `app.js` (formulario de tarea, creación de tareas semanales, listas y fechas relativas) |
| RN8 | Exámenes próximos y pasados | `app.js` (listas de exámenes) |
| RN9, RN10 | Filtros, orden y secciones | `filtros.js` (`coincideConFiltros`, `ordenarPorPrioridad`, `seccionDesplegable`, `seccionAbierta`) |
| RN11–RN14 | Progreso, panel y detalle de materia | `app.js` (vista de inicio y vista de materias) |
| RN15 | Calendario | `app.js` (vista de calendario) |
| RN16–RN21 | Horario y superposiciones | `horario.js` (`validarYGuardarClase`, `buscarSuperposicion`, `guardarClase`, `eliminarClase`, `miembrosDeClase`, `clasesAgrupadas`, `vistaHorario`) |
| RN22–RN27 | Pomodoro, No molestar, sonido | `enfoque.js` (`avanzarEnfoque`, `restanteEnfoqueMs`, `liberarAvisos`, `actualizarSonido`, `sonarAlarma`) |
| RN28, RN29 | Persistencia y marcas | `app.js` (carga, `guardarLocal`, `estampar`, `leerMeta`, `guardarMeta`) |
| RN30 | Deshacer y lápidas | `app.js` (`eliminarConDeshacer`) |
| RN31–RN34 | Copias y recordatorio | `copias.js` (`exportarCopia`, `leerCopia`, `importarCopia`, `reemplazarDatos`, `avisoDeCopia`) |
| RN35–RN40 | Sincronización | `sincronizacion.js` (`sincronizacionConfigurada`, `enviarEnlaceDeAcceso`, `fusionarDatos`, `sincronizarAhora`, `programarSincronizacion`) |
| RN41 | Escape de contenido | `app.js` (`escaparHtml`, `enlazar`) |
| RN42 | Secretos | `configuracion.js`; políticas RLS en Supabase |
| RN43 | Presentación | `presentacion.js` |
| RN44 | Tema y adaptación | `estilos.css` |

## 8. Seguridad

- **Entrada:** todo texto se escapa antes de entrar al HTML; los enlaces solo se activan para `http(s)` con `rel="noopener noreferrer"` (RN41).
- **Secretos:** solo URL y clave publicable en `configuracion.js`. La clave publicable es pública por diseño; la protección real son las políticas RLS (RN42).
- **Acceso:** cada usuario solo lee y escribe la fila cuyo `usuario_id` coincide con su identidad.
- **Datos locales:** quedan en el navegador de la persona; la copia de seguridad es un archivo que ella controla.

## 9. Despliegue

Archivos estáticos publicados en GitHub Pages (HTTPS), rama `main`. Publicar por HTTPS es necesario para el inicio de sesión (RN36). No hay paso de compilación: publicar es subir los archivos.

Link público: https://mateoguinsburg35.github.io/EstudIA/

## 10. Riesgos y límites conocidos

| Riesgo | Tratamiento |
|---|---|
| Relojes desajustados entre dispositivos | Aceptado (CB18, D35). |
| Copias editadas a mano con referencias inválidas | Aceptado; se muestran como «Sin materia» (CB19, D36). |
| Navegador que purga `localStorage` | Almacenamiento persistente solicitado, copias de seguridad y recordatorio (RN34). |
| Falta de políticas RLS | Se verifica en `docs/informe-pruebas.md` (caso PS-09). |
