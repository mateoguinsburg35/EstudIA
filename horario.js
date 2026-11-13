/* Horario semanal fijo de cursada, con aviso de superposiciones. */
const NOMBRES_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function aMinutos(hora) {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

function diaDeLaSemana(fecha) {
  return (fecha.getDay() + 6) % 7; // 0 = lunes
}

function clasesOrdenadas() {
  return [...datos.horarios].sort((a, b) => a.dia - b.dia || a.inicio.localeCompare(b.inicio));
}

function clasesDeHoy() {
  return clasesOrdenadas().filter((clase) => clase.dia === diaDeLaSemana(new Date()));
}

function buscarSuperposicion(candidata, idIgnorado) {
  return datos.horarios.find((clase) => clase.id !== idIgnorado && clase.dia === candidata.dia
    && clase.inicio < candidata.fin && candidata.inicio < clase.fin);
}

function textoHorario(clase) {
  return `${NOMBRES_DIAS[clase.dia]} ${clase.inicio} a ${clase.fin}`;
}

function filaClase(clase, conControles) {
  const materia = materiaPorId(clase.materiaId);
  return `<li class="fila">
    <span class="marca-color" style="--c:${escaparHtml(materia ? materia.color : "#5B6480")}" title="Clase"></span>
    <div class="fila-texto"><strong>${escaparHtml(materia ? materia.nombre : "Sin materia")}</strong>
      <div class="meta"><span>${textoHorario(clase)}</span></div></div>
    <div class="acciones">${conControles ? botonesEdicion("horario", clase.id) : `<span class="meta">Clase</span>`}</div></li>`;
}

function vistaHorario() {
  const clases = clasesOrdenadas();
  const dias = NOMBRES_DIAS.map((_, indice) => indice).filter((dia) => dia < 5 || clases.some((c) => c.dia === dia));
  const desde = Math.min(8, ...clases.map((c) => Math.floor(aMinutos(c.inicio) / 60)));
  const hasta = Math.max(18, ...clases.map((c) => Math.ceil(aMinutos(c.fin) / 60)));
  const etiquetasHoras = Array.from({ length: hasta - desde }, (_, i) =>
    `<span style="top:calc(${i} * var(--alto-hora))">${String(desde + i).padStart(2, "0")}:00</span>`).join("");

  const columnas = dias.map((dia) => {
    const bloques = clases.filter((c) => c.dia === dia).map((clase) => {
      const materia = materiaPorId(clase.materiaId);
      const arriba = (aMinutos(clase.inicio) - desde * 60) / 60;
      const alto = (aMinutos(clase.fin) - aMinutos(clase.inicio)) / 60;
      return `<button class="bloque" style="--c:${escaparHtml(materia ? materia.color : "#5B6480")};top:calc(${arriba} * var(--alto-hora));height:calc(${alto} * var(--alto-hora))"
        data-accion="editar-horario" data-id="${clase.id}"><strong>${escaparHtml(materia ? materia.nombre : "Sin materia")}</strong><span>${clase.inicio}–${clase.fin}</span></button>`;
    }).join("");
    return `<div class="grilla-dia"><div class="grilla-titulo">${NOMBRES_DIAS[dia].slice(0, 3)}</div>
      <div class="grilla-cuerpo" style="--horas:${hasta - desde}">${bloques}</div></div>`;
  }).join("");

  const boton = `<button class="boton primario" data-accion="nueva-clase">Nueva clase</button>`;
  return `${encabezado("Horario", "Tu semana de cursada", boton)}
    <div class="grilla"><div class="grilla-horas" style="--horas:${hasta - desde}">${etiquetasHoras}</div>${columnas}</div>
    <h2>Clases</h2>${listaDeFilas(clases.map((c) => filaClase(c, true)), "Todavía no cargaste clases.")}`;
}

function formularioClase(clase, valoresPrevios) {
  if (!hayMaterias()) return;
  abrirFormulario({
    titulo: clase ? "Editar clase" : "Nueva clase",
    campos: [
      { nombre: "materiaId", etiqueta: "Materia", tipo: "select", opciones: opcionesDeMaterias() },
      { nombre: "dia", etiqueta: "Día", tipo: "select", opciones: NOMBRES_DIAS.map((nombre, i) => ({ valor: String(i), texto: nombre })) },
      { nombre: "inicio", etiqueta: "Desde", tipo: "time" },
      { nombre: "fin", etiqueta: "Hasta", tipo: "time" }
    ],
    valores: valoresPrevios || (clase ? { ...clase, dia: String(clase.dia) }
      : { materiaId: datos.materias[0].id, dia: "0", inicio: "08:00", fin: "12:00" }),
    alGuardar: (valores) => validarYGuardarClase(clase, valores)
  });
}

function validarYGuardarClase(clase, valores) {
  const nueva = { ...valores, dia: Number(valores.dia) };
  if (nueva.fin <= nueva.inicio) {
    mostrarAviso("La hora de fin tiene que ser posterior a la de inicio.");
    formularioClase(clase, valores);
    return;
  }
  const guardar = () => {
    if (clase) Object.assign(clase, estampar(nueva));
    else datos.horarios.push({ id: nuevoId(), ...estampar(nueva) });
    guardarYRenderizar();
  };
  const choque = buscarSuperposicion(nueva, clase?.id);
  if (!choque) { guardar(); return; }
  const materiaChoque = materiaPorId(choque.materiaId);
  abrirFormulario({
    titulo: "Horario ocupado",
    mensaje: `Esta clase se superpone con ${escaparHtml(materiaChoque ? materiaChoque.nombre : "otra clase")} (${textoHorario(choque)}). ¿Querés guardarla igual?`,
    textoBoton: "Guardar igual",
    alGuardar: guardar
  });
}
