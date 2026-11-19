# AGENTS.md – Reglamento de trabajo de EstudIA

Este archivo orienta a cualquier persona o agente de IA que trabaje en el repositorio. Leelo completo antes de tocar código.

## 1. Proyecto

**EstudIA** es una SPA para estudiantes que organiza materias, tareas, exámenes y horarios de cursada, con Pomodoro, copias de seguridad y sincronización opcional. Funciona sin conexión (offline-first).
Link público: https://mateoguinsburg35.github.io/EstudIA/

## 2. Stack

| Capa | Tecnología |
|---|---|
| Interfaz | HTML5, CSS3 (variables de color, tema claro/oscuro automático), JavaScript vainilla |
| Módulos | Scripts clásicos cargados en orden desde `index.html` (sin bundler, sin framework) |
| Datos locales | `localStorage` (`estudia:v1` datos, `estudia:meta:v1` datos del dispositivo) |
| Nube (opcional) | Supabase: autenticación por enlace al correo y tabla `datos_usuario` |
| Audio | Web Audio API (alarma y ruido de fondo) |
| Hosting | GitHub Pages (HTTPS) |
| Tipografía | Bricolage Grotesque (Google Fonts) con respaldo del sistema |

No se agregan dependencias ni herramientas de compilación sin una decisión registrada en `docs/decisiones.md`.

## 3. Ubicación de archivos

```
/
├── index.html            Estructura, menú y orden de carga de scripts
├── estilos.css           Estilos, variables y diseño adaptable
├── app.js                Estado, vistas, formularios, avisos, utilidades, tareas, exámenes, materias, calendario, panel
├── horario.js            Horario semanal y superposiciones
├── filtros.js            Búsqueda, filtro por materia, orden por prioridad, secciones
├── enfoque.js            Pomodoro, No molestar, sonido
├── copias.js             Exportar e importar copias
├── sincronizacion.js     Supabase y fusión por marcas de tiempo
├── presentacion.js       Página de bienvenida
├── configuracion.js      URL y clave publicable de Supabase (único lugar de configuración)
├── AGENTS.md             Este archivo
├── README.md             Presentación y uso
├── img/
|    └── logo.png
└── docs/
    ├── idea.md · spec.md · plan.md · tasks.md
    ├── decisiones.md · glosario.md · preguntas-abiertas.md
    ├── manual-usuario.md
    └── informe-pruebas.md
```

**Orden de carga (importa):** `configuracion.js` → librería de Supabase → `sincronizacion.js` → `copias.js` → `horario.js` → `filtros.js` → `presentacion.js` → `enfoque.js` → `app.js`. `app.js` va último porque arranca la aplicación.

## 4. Fuente de verdad

Si dos documentos se contradicen, manda el de arriba:

1. `docs/spec.md` – qué hace la app (reglas RN y historias HU).
2. `docs/plan.md` – cómo está construida.
3. `docs/tasks.md` – en qué orden se construyó.
4. `docs/decisiones.md` – por qué se eligió cada cosa.
5. El código.

Si el código y la spec difieren, **se corrige lo que esté mal** y se deja registro; nunca se deja la diferencia sin resolver.

## 5. Ciclo de trabajo

1. **Especificar:** todo cambio de comportamiento empieza en `docs/spec.md` (nueva RN o HU, o ajuste de una existente).
2. **Planificar:** agregar la tarea a `docs/tasks.md` con su RN/HU y su criterio de aceptación, respetando dependencias.
3. **Decidir:** si hay una alternativa relevante, registrarla en `docs/decisiones.md`; si hay una duda, en `docs/preguntas-abiertas.md`.
4. **Implementar** en el archivo que corresponde (sección 3), en cambios pequeños.
5. **Probar:** ejecutar los casos de `docs/informe-pruebas.md` y registrar el resultado.
6. **Cerrar:** marcar la tarea como completada y actualizar glosario y README si hace falta.

## 6. Reglas de código

- **Idioma:** nombres de funciones, variables, textos de interfaz y documentación en español. Los textos de interfaz usan voseo rioplatense («Guardá», «Elegí»).
- **Escape obligatorio:** todo texto ingresado por la persona pasa por `escaparHtml` antes de insertarse en HTML (RN41). Los enlaces se generan solo con `enlazar`.
- **Marca de modificación:** todo elemento que se crea o edita pasa por `estampar` (RN29). Sin marca, la sincronización falla en silencio.
- **Borrados:** siempre por `eliminarConDeshacer`, que registra la lápida (RN30). Nunca `splice` directo sobre las colecciones de datos.
- **Persistencia:** después de cambiar `datos`, usar `guardarYRenderizar()` (o `guardarLocal()` + `render()`).
- **Datos del dispositivo:** lo que no debe sincronizarse va en `guardarMeta`/`leerMeta`, no en `datos` (RN28).
- **Compatibilidad de datos:** no cambiar el formato de las colecciones sin migración; las copias antiguas deben seguir importándose (RN32).
- **Estilos:** colores solo mediante variables CSS definidas en `:root`; toda variable nueva debe tener valor para claro y oscuro (RN44).
- **Estructura:** un archivo por responsabilidad; funciones cortas y con un propósito; comentarios solo para explicar el porqué.

## 7. Secretos y seguridad

- `configuracion.js` es el **único** lugar con datos de Supabase y contiene solo la URL y la **clave publicable**.
- Prohibido incluir en el repositorio claves de servicio (`service_role`), contraseñas o tokens.
- La confidencialidad entre usuarios depende de las políticas RLS en Supabase (ver `docs/plan.md`); cualquier cambio en la tabla debe revisar esas políticas.
- No se usan `eval`, `innerHTML` con texto sin escapar ni scripts de orígenes no listados.

## 8. Trabajo con agentes de IA

- El agente propone y redacta; la persona responsable decide, revisa y valida.
- Entregar **archivos completos** con su nombre original e indicar cuáles reemplazar, en lugar de fragmentos sueltos.
- No hacer commits, pushes ni cambios en el repositorio remoto sin pedido explícito.
- No inventar resultados de pruebas: el informe solo registra lo que se ejecutó realmente.
- Ante una duda de negocio, preguntar o registrarla en `docs/preguntas-abiertas.md`; no suponer.
- Antes de modificar código, leer la RN afectada en `docs/spec.md` y los archivos que la implementan (`docs/plan.md`, sección 7).

## 9. Definición de terminado

Una tarea está terminada cuando: cumple su criterio de aceptación; la spec, el plan y las tareas reflejan el cambio; los casos de prueba relacionados fueron ejecutados y registrados; funciona en claro y oscuro y en celular y escritorio; y no se agregaron secretos al repositorio.
