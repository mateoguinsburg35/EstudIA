/* Filtros y búsqueda de las listas de tareas y exámenes. */
const filtros = {
  tareas: { texto: "", materiaId: "", prioridad: "", estado: "" },
  examenes: { texto: "", materiaId: "", prioridad: "", estado: "" }
};

function opcionesHtml(lista, valorActual) {
  return lista.map(([valor, texto]) => `<option value="${escaparHtml(valor)}"${valor === valorActual ? " selected" : ""}>${escaparHtml(texto)}</option>`).join("");
}

function barraFiltros(vista) {
  const f = filtros[vista];
  const estados = vista === "tareas"
    ? [["", "Todas"], ["pendientes", "Pendientes"], ["completadas", "Completadas"]]
    : [["", "Todos"], ["proximos", "Próximos"], ["pasados", "Pasados"]];
  const materias = [["", "Todas las materias"], ...datos.materias.map((m) => [m.id, m.nombre])];
  const prioridades = [["", "Toda prioridad"], ...PRIORIDADES.map((p) => [p.valor, p.texto])];
  return `<div class="filtros">
    <input type="search" placeholder="Buscar…" value="${escaparHtml(f.texto)}" data-filtro="texto" aria-label="Buscar">
    <select data-filtro="materiaId" aria-label="Materia">${opcionesHtml(materias, f.materiaId)}</select>
    <select data-filtro="prioridad" aria-label="Prioridad">${opcionesHtml(prioridades, f.prioridad)}</select>
    <select data-filtro="estado" aria-label="Estado">${opcionesHtml(estados, f.estado)}</select></div>`;
}

function coincideConFiltros(item, f) {
  const nombreMateria = materiaPorId(item.materiaId)?.nombre || "";
  const texto = `${item.titulo} ${item.descripcion || ""} ${nombreMateria}`.toLowerCase();
  return (!f.materiaId || item.materiaId === f.materiaId)
    && (!f.prioridad || item.prioridad === f.prioridad)
    && (!f.texto || texto.includes(f.texto.toLowerCase()));
}

function bloqueFiltrado(titulo, elementos, f, crearFila) {
  const filas = elementos.filter((elemento) => coincideConFiltros(elemento, f)).map(crearFila);
  return `<h2>${titulo}</h2>${listaDeFilas(filas, "No hay resultados.")}`;
}

function resultadosTareas() {
  const f = filtros.tareas;
  const fila = (tarea) => filaTarea(tarea, true);
  return (f.estado !== "completadas" ? bloqueFiltrado("Pendientes", tareasPendientes(), f, fila) : "")
    + (f.estado !== "pendientes" ? bloqueFiltrado("Completadas", tareasCompletadas(), f, fila) : "");
}

function resultadosExamenes() {
  const f = filtros.examenes;
  const fila = (examen) => filaExamen(examen, true);
  return (f.estado !== "pasados" ? bloqueFiltrado("Próximos", examenesProximos(), f, fila) : "")
    + (f.estado !== "proximos" ? bloqueFiltrado("Pasados", examenesPasados(), f, fila) : "");
}

function alCambiarFiltro(evento) {
  const control = evento.target.closest("[data-filtro]");
  if (!control) return;
  filtros[vistaActual][control.dataset.filtro] = control.value;
  document.getElementById("resultados").innerHTML = vistaActual === "tareas" ? resultadosTareas() : resultadosExamenes();
}
document.addEventListener("input", alCambiarFiltro);
document.addEventListener("change", alCambiarFiltro);
