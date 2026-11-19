# Decisiones de diseño y arquitectura

Cada decisión indica qué se decidió, qué alternativa se descartó, el motivo y las reglas de `docs/spec.md` a las que afecta.

## 1. Arquitectura general

**D1 – SPA en JavaScript vainilla, sin frameworks ni compilación.**
Alternativa: React/Vue con herramientas de build.
Motivo: la app se publica como archivos estáticos, es liviana y no requiere cadena de compilación. El código se separa en archivos por responsabilidad (`app.js`, `horario.js`, `filtros.js`, `enfoque.js`, `copias.js`, `sincronizacion.js`, `presentacion.js`).

**D2 – Renderizado por funciones que devuelven HTML y delegación de eventos con `data-accion`.**
Alternativa: manipular el DOM elemento por elemento.
Motivo: un único `render()` y una tabla `ACCIONES` simplifican el flujo y evitan registrar listeners en cada fila. (RN43)

**D3 – Formulario modal único y configurable.**
Alternativa: un formulario por entidad.
Motivo: `abrirFormulario` cubre materias, tareas, exámenes, clases, confirmaciones y el inicio de sesión, con validación común. (RN1, RN4)

## 2. Modelo de datos

**D4 – Cuatro colecciones planas (`materias`, `tareas`, `examenes`, `horarios`) más `eliminados`.**
Alternativa: anidar tareas dentro de materias.
Motivo: los elementos se relacionan por `materiaId`, lo que permite consultar por fecha en el calendario y sincronizar cada elemento por separado. (RN3, RN38)

**D5 – Identificadores generados en el cliente.**
Alternativa: ids del servidor.
Motivo: permiten crear datos sin conexión sin riesgo de colisión práctica.

**D6 – Fechas ISO `AAAA-MM-DD` y horas `HH:MM` como texto.**
Alternativa: objetos `Date` o marcas de tiempo.
Motivo: se comparan con orden alfabético, no sufren desfases de zona horaria y se serializan sin pérdida. (RN6, RN8, RN17)

**D7 – Exámenes sin estado «completado».**
Alternativa: tratarlos como tareas.
Motivo: un examen es un evento con fecha, no algo que se «termina»; por eso no entra en el progreso. (RN8, RN11)

## 3. Persistencia

**D8 – `localStorage` como almacenamiento principal.**
Alternativa: IndexedDB.
Motivo: el volumen de datos es pequeño y la API es síncrona y simple. Se pide almacenamiento persistente al navegador. (RN28)

**D9 – Datos propios del dispositivo en una clave aparte (`estudia:meta:v1`).**
Alternativa: guardarlos junto a los datos de usuario.
Motivo: preferencias como las secciones abiertas no deben viajar a otros dispositivos. (RN10, RN28)

## 4. Sincronización

**D10 – Offline-first: los datos locales son la fuente principal.**
Alternativa: servidor como fuente de verdad.
Motivo: la app debe funcionar sin conexión y un fallo de red nunca debe perder datos. (RN28, RN40)

**D11 – Supabase con un documento JSON por usuario.**
Alternativa: una tabla por colección.
Motivo: reduce la complejidad del servidor y la cantidad de llamadas. Cada sincronización lee y escribe una sola fila. (RN37)

**D12 – Fusión por elemento con marca `modificado`; en empate gana lo local.**
Alternativa: gana siempre el último dispositivo en sincronizar.
Motivo: conserva ediciones de dispositivos distintos sobre elementos distintos. Una regla de empate fija vuelve el resultado determinista. (RN38)

**D13 – Lápidas para los borrados.**
Alternativa: borrar sin dejar rastro.
Motivo: sin ellas, un elemento eliminado en un dispositivo reaparecería al sincronizar con otro. Reaparece solo si se editó después del borrado. (RN30, RN38)

**D14 – Sincronización con *debounce* de 1,5 s, una a la vez y con cola.**
Alternativa: sincronizar en cada cambio.
Motivo: evita ráfagas de pedidos y condiciones de carrera. Se dispara además al volver a la app, al recuperar conexión y manualmente. (RN39)

**D15 – Inicio de sesión por enlace al correo.**
Alternativa: usuario y contraseña.
Motivo: no hay contraseñas que gestionar ni guardar. Requiere HTTPS, por eso se avisa si se abre desde un archivo local. (RN36)

## 5. Horario de cursada

**D16 – Una entrada por día unida por un campo `grupo`.**
Alternativa: una entrada con arreglo de días.
Motivo: el formato de los datos no cambia y la sincronización sigue funcionando por elemento. (RN18, RN19)

**D17 – La superposición es un aviso, no un bloqueo.**
Alternativa: impedir guardar clases que chocan.
Motivo: hay casos legítimos (clases alternadas por semana, comisiones optativas). Se informa el choque y la persona decide con «Guardar igual». (RN17)

**D18 – Intervalos abiertos: las clases consecutivas no chocan.**
Alternativa: tratar el instante compartido como choque.
Motivo: terminar a las 10:00 y empezar a las 10:00 es una cursada normal. (RN17)

**D19 – Rango de la grilla dinámico, con mínimo de 08:00 a 18:00.**
Alternativa: rango fijo.
Motivo: una grilla vacía no se ve deforme y una clase tardía nunca queda fuera. (RN21)

## 6. Tareas

**D20 – La recurrencia crea tareas independientes.**
Alternativa: una «tarea madre» con regla de repetición.
Motivo: cada semana se completa, edita o elimina por separado, y no hace falta resolver «editar solo esta o todas». (RN5)

**D21 – Opciones de repetición fijas (1, 4, 8 o 16 semanas) y solo al crear.**
Alternativa: cantidad libre o repetición también al editar.
Motivo: 16 semanas equivale a un cuatrimestre; las opciones fijas simplifican el formulario y la edición afecta una sola tarea. (RN5)

**D22 – Progreso calculado solo sobre tareas.**
Alternativa: incluir exámenes y clases.
Motivo: solo las tareas tienen estado de avance. Las materias sin tareas no aparecen en el progreso. (RN11, RN12)

## 7. Modo Enfoque

**D23 – Reloj por instante de fin previsto.**
Alternativa: restar un segundo en cada tick.
Motivo: los navegadores frenan los temporizadores en pestañas en segundo plano; el instante absoluto mantiene la exactitud. (RN23)

**D24 – Descanso fijo de 5 minutos y bloque a elegir entre cuatro duraciones.**
Alternativa: duraciones libres y ciclos largos.
Motivo: simplicidad y fidelidad al Pomodoro clásico. Al terminar el descanso el temporizador se detiene para que la persona decida cuándo seguir. (RN22)

**D25 – No molestar retiene los avisos, salvo los que traen Deshacer.**
Alternativa: silenciar todos los avisos.
Motivo: un borrado accidental durante el estudio debe poder revertirse. (RN26)

**D26 – Ruido generado en el navegador con Web Audio.**
Alternativa: archivos de audio.
Motivo: sin descargas ni derechos de autor, y funciona sin conexión. Suena solo durante el estudio. (RN27)

## 8. Copias de seguridad

**D27 – Exportación en JSON con identificador de aplicación y versión.**
Alternativa: formato propio o CSV.
Motivo: permite validar el origen del archivo y evolucionar el formato. Las copias antiguas sin horarios siguen siendo válidas. (RN31, RN32)

**D28 – Restaurar reemplaza los datos, con confirmación y lápidas para lo ausente.**
Alternativa: combinar la copia con los datos actuales.
Motivo: restaurar significa volver a un estado conocido; las lápidas impiden que la sincronización traiga de vuelta lo descartado. (RN33)

**D29 – Recordatorio de respaldo cada 14 días, solo sin sesión.**
Alternativa: recordatorio permanente.
Motivo: con sesión los datos ya están protegidos en la nube; el aviso no aparece durante el estudio. (RN34)

## 9. Experiencia de usuario y seguridad

**D30 – Deshacer en lugar de confirmar cada borrado.**
Alternativa: diálogo de confirmación antes de eliminar.
Motivo: es más rápido y recuperable. La confirmación se reserva para la restauración de copias, que es destructiva. (RN30, RN33)

**D31 – Presentación como pantalla inicial.**
Alternativa: abrir directo en el panel.
Motivo: explica la propuesta de la app y sirve para la entrega. (RN43)

**D32 – Tema claro/oscuro automático y diseño adaptable.**
Alternativa: selector manual de tema.
Motivo: respeta la preferencia del sistema sin agregar configuración. En celulares el menú pasa a la parte inferior. (RN44)

**D33 – Escape de todo texto ingresado.**
Alternativa: confiar en la entrada.
Motivo: evita la inyección de HTML; los enlaces solo se activan para `http(s)`. (RN41)

**D34 – Secretos aislados en `configuracion.js`, solo clave publicable.**
Alternativa: claves repartidas en el código o clave de servicio.
Motivo: la clave publicable es pública por diseño; la confidencialidad la garantiza RLS. Nunca se incluye una clave de servicio. (RN42)

## 10. Límites aceptados

**D35 – CB18: la fusión confía en el reloj de cada dispositivo.**
Situación: un dispositivo con la hora muy adelantada puede ganar conflictos.
Decisión: se acepta. El modelo es «última modificación gana por elemento», adecuado para un único usuario con pocos dispositivos. Un reloj lógico o CRDT agregaría complejidad desproporcionada.
Mitigación: la fusión opera por elemento, no por documento, y los dispositivos suelen sincronizar la hora automáticamente. (RN38)

**D36 – CB19: la importación valida la estructura, no las referencias.**
Situación: una copia puede traer tareas que apuntan a una materia inexistente.
Decisión: se acepta. La validación exige colecciones válidas y `id` de texto en cada elemento. Los elementos huérfanos se muestran como «Sin materia» y no rompen la app.
Mitigación: las copias las genera la propia app, que no produce huérfanos; solo ocurriría con un archivo editado a mano. (RN32)
