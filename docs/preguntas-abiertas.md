# Preguntas abiertas

Dudas que surgieron durante el diseño, la regla que afectaban y cómo quedaron resueltas. Todas están **resueltas**; no quedan pendientes.

| N° | Pregunta | Regla afectada | Resolución | Estado |
|---|---|---|---|---|
| P1 | ¿Qué pasa con las tareas, exámenes y clases al eliminar una materia? | RN3 | Se eliminan en cascada, con un único aviso que indica la cantidad y un Deshacer que restaura todo (D4, D30). | Resuelta |
| P2 | ¿Se puede crear una actividad sin materia? | RN2 | No. La app lleva a Materias y avisa que primero hay que crear una. | Resuelta |
| P3 | Al repetir una tarea semanalmente, ¿se editan todas juntas o por separado? | RN5 | Son independientes: editar o eliminar afecta una sola. La repetición se elige solo al crear (D20, D21). | Resuelta |
| P4 | ¿Cuántas repeticiones ofrecer? | RN5 | 1, 4, 8 o 16 semanas; 16 equivale a un cuatrimestre (D21). | Resuelta |
| P5 | ¿Una tarea completada puede figurar como vencida? | RN7 | No: solo se resaltan las pendientes con fecha anterior a hoy. | Resuelta |
| P6 | ¿Un examen se «completa»? ¿Cuenta para el progreso? | RN8, RN11 | No tiene estado de completado y no cuenta. Pasa a *pasado* cuando su fecha es anterior a hoy (D7). | Resuelta |
| P7 | ¿Un examen de hoy es próximo o pasado? | RN8 | Próximo: se considera próximo hasta el final de su fecha. | Resuelta |
| P8 | ¿El progreso incluye exámenes y clases? ¿Qué se muestra sin tareas? | RN11, RN12 | Solo tareas. Sin tareas se muestra 0 % y «Todavía no cargaste tareas»; las materias sin tareas no aparecen (D22). | Resuelta |
| P9 | En el orden por prioridad, ¿cómo se desempata? | RN9 | Dentro de cada prioridad se conserva el orden por fecha (descendente en exámenes pasados). | Resuelta |
| P10 | ¿Los filtros se comparten entre Tareas y Exámenes? | RN9 | No, cada vista tiene los suyos. Si la materia filtrada se elimina, el filtro se reinicia. | Resuelta |
| P11 | ¿Deben recordarse las secciones abiertas o cerradas? ¿Se sincronizan? | RN10 | Se recuerdan por dispositivo y no se sincronizan (D9). | Resuelta |
| P12 | ¿Las clases consecutivas se consideran superpuestas? | RN17 | No: se usan intervalos abiertos (D18). | Resuelta |
| P13 | ¿Una superposición debe impedir guardar? | RN17 | No: se informa y la persona decide con «Guardar igual» (D17). | Resuelta |
| P14 | ¿Cómo representar una clase que se repite varios días sin cambiar el formato de datos? | RN18 | Una entrada por día unidas por `grupo` (D16). | Resuelta |
| P15 | Al editar una clase repetida, ¿cómo evitar choques consigo misma y entradas huérfanas? | RN17, RN19 | Se ignoran las entradas propias en la detección. Se reutilizan, mueven o crean entradas y las sobrantes se eliminan con Deshacer. | Resuelta |
| P16 | ¿Qué rango horario mostrar en la grilla? | RN21 | De 08:00 a 18:00 como mínimo, ampliable según las clases (D19). | Resuelta |
| P17 | ¿Cómo mantener exacto el temporizador con la pestaña en segundo plano? | RN23 | Se calcula contra el instante de fin previsto, no contando ticks (D23). | Resuelta |
| P18 | ¿Qué hace el temporizador al terminar el descanso? | RN22 | Se detiene y queda listo para un nuevo bloque; no encadena ciclos (D24). | Resuelta |
| P19 | ¿Qué pasa si se cambia la duración con el reloj en marcha? | RN24 | No altera el bloque actual: solo se reajusta si está detenido y en estudio. | Resuelta |
| P20 | ¿No molestar debe ocultar también los borrados reversibles? | RN26 | No: los avisos con Deshacer siempre se muestran (D25). | Resuelta |
| P21 | ¿Cuándo debe sonar el ruido de fondo? | RN27 | Solo con el estudio en marcha; se detiene al pausar o descansar (D26). | Resuelta |
| P22 | ¿Qué datos no deben viajar entre dispositivos? | RN28 | Los de «meta»: secciones abiertas, última copia y última sincronización (D9). | Resuelta |
| P23 | ¿Cómo evitar que un elemento eliminado reaparezca al sincronizar? | RN30, RN38 | Lápidas con la hora del borrado; reaparece solo si se editó después (D13). | Resuelta |
| P24 | ¿Cómo se restaura un elemento recién eliminado? | RN30 | Deshacer quita la lápida y renueva `modificado`, de modo que prevalece en la fusión (CB17). | Resuelta |
| P25 | ¿Qué hacer con una copia antigua sin `horarios`? | RN32 | Se acepta y se asumen horarios vacíos (CB7). | Resuelta |
| P26 | Al restaurar una copia, ¿qué pasa con lo que no está en ella? | RN33 | Se marca como eliminado, para que la sincronización no lo traiga de vuelta (D28). | Resuelta |
| P27 | ¿Cuándo recordar el respaldo? | RN34 | Con datos, sin sesión, sin copia en 14 días y fuera de No molestar (D29). | Resuelta |
| P28 | ¿Qué ocurre si dos dispositivos editan lo mismo sin conexión? | RN38 | Prevalece el `modificado` mayor; en empate, la versión local (D12). | Resuelta |
| P29 | ¿Qué pasa si llega un pedido de sincronización mientras otro está en curso? | RN39 | Se encola y se reprograma al terminar (D14). | Resuelta |
| P30 | ¿Qué ocurre si falla la sincronización? | RN40 | No se pierden datos locales; se informa y se reintenta en el próximo disparador (D10). | Resuelta |
| P31 | ¿Puede iniciarse sesión abriendo la app como archivo local? | RN36 | No: se avisa que debe abrirse desde una dirección web con HTTPS (D15). | Resuelta |
| P32 | ¿Es seguro publicar la clave de Supabase en el repositorio? | RN42 | Solo la clave publicable, que es pública por diseño. La protección real son las políticas RLS por usuario; nunca se incluye una clave de servicio (D34). | Resuelta |
| P33 | ¿Qué pasa si el reloj de un dispositivo está desajustado? | RN38 | Es un límite aceptado del modelo «última modificación gana» (CB18, D35). | Resuelta (aceptada) |
| P34 | ¿Se valida que una copia importada no tenga referencias a materias inexistentes? | RN32 | No; se valida la estructura y los huérfanos se muestran como «Sin materia» (CB19, D36). | Resuelta (aceptada) |