import { isFirebaseReady, saveResponse, subscribeResults } from './firebase.js';

/* ============================================================
   CONTENIDO EDITABLE
   - imagen: portada de la galería y de la obra (assets/).
     Para reemplazarla, cambia el archivo o la ruta aquí.
   - lugar: silueta del lugar que aparece al pasar el cursor o al hacer clic.
   - portada: imagen opcional en assets/portadas/<id>-portada.jpg (p. ej. juicio-zoologico-portada.jpg).
   - resumen: párrafos del «Resumen de la historia».
   - "Por completar": datos que aún no se han confirmado.
   - id: se conserva; es la parte final de la URL (#id).
   ============================================================ */

const POR_COMPLETAR = 'Por completar';

const WORKS = [
  {
    id: 'juicio-zoologico',
    grado: '6.º de primaria',
    titulo: 'Juicio en el Zoológico',
    autor: 'Alberto Thieroldt',
    tono: '#c98b3c',
    imagen: 'assets/juicio-zoologico.jpg',
    respaldo: 'assets/juicio-zoologico.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/9f3a6b200e4392681323b09fe252049d27c7929f/zoologico.svg',
    descripcion: 'Una historia que invita a mirar una misma situación desde distintos puntos de vista.',
    sinopsis: 'En el zoológico se desarrolla un juicio en el que los animales participan para exponer sus opiniones y cuestionar el trato que reciben de los seres humanos. A través de situaciones y argumentos, la historia presenta una reflexión sobre la justicia, la libertad y la responsabilidad hacia los animales.',
    contexto: 'Obra del escritor peruano Alberto Thieroldt que utiliza una situación ficticia y personajes animales para transmitir reflexiones sobre la sociedad y el comportamiento humano.',
    resumen: [
      'La historia presenta un juicio realizado en un zoológico, donde los animales participan como protagonistas de una situación que refleja el comportamiento de los seres humanos. A través de sus intervenciones y del desarrollo del juicio, se muestran temas como la justicia, la responsabilidad y la manera en que las personas juzgan las acciones de los demás.',
      'La obra invita a reflexionar sobre el respeto hacia los animales y la importancia de actuar con justicia.'
    ],
    personajes: ['Alejandro', 'El León Arturo', 'La Cebra María', 'La Jirafa', 'Los Monos', 'El Elefante']
  },
  {
    id: 'ruisenor-rosa',
    grado: '1.º de secundaria',
    titulo: 'El Ruiseñor y la Rosa',
    autor: 'Oscar Wilde',
    tono: '#1f2a4d',
    imagen: 'assets/ruisenor-rosa.jpg',
    respaldo: 'assets/ruisenor-rosa.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/5da455933d43bf7823d7a819215be10a2278e41e/jardin.svg',
    descripcion: 'Un cuento sobre la entrega, el deseo y el precio de los sueños.',
    sinopsis: 'Un ruiseñor escucha a un joven enamorado que necesita una rosa roja para cumplir su deseo, y se pregunta hasta dónde está dispuesto a llegar para ayudarlo.',
    contexto: 'Cuento de Oscar Wilde incluido en la colección de 1888 «El príncipe feliz y otros cuentos».',
    resumen: [
      'Un joven estudiante está enamorado de una muchacha que le exige una rosa roja para aceptar bailar con él. Al escuchar su tristeza, un ruiseñor decide ayudarlo porque cree en el verdadero amor. Sin embargo, como no encuentra rosas rojas, el ruiseñor sacrifica su propia vida: canta toda la noche mientras una espina atraviesa su corazón, tiñendo una rosa blanca con su sangre.',
      'El joven consigue la rosa y se la entrega a la muchacha, pero ella la rechaza porque ha recibido joyas de otro pretendiente. Decepcionado, el estudiante pierde la fe en el amor y vuelve a sus libros.'
    ],
    personajes: ['El ruiseñor', 'La rosa', 'El joven estudiante', 'La hija del profesor']
  },
  {
    id: '36-kilos',
    grado: '2.º de secundaria',
    titulo: '36 Kilos',
    autor: 'Mónica Beltrán Brozón',
    tono: '#8a6bb0',
    imagen: 'assets/36-kilos.jpg',
    respaldo: 'assets/36-kilos.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/5da455933d43bf7823d7a819215be10a2278e41e/escuela.svg',
    descripcion: 'Una novela juvenil sobre la amistad, la adolescencia, la autoestima, los cambios físicos y la aceptación personal.',
    sinopsis: 'La vida de dos amigas adolescentes que atraviesan distintas experiencias relacionadas con la amistad, los sentimientos, la imagen corporal y los cambios propios de crecer.',
    contexto: 'Novela juvenil de la escritora mexicana M. B. Brozon, que aborda problemáticas propias de la adolescencia mediante una narración cercana y reflexiva.',
    resumen: [
      'La historia trata sobre Regina y Fernanda, dos amigas muy unidas que atraviesan los cambios propios de la adolescencia. Regina comienza a preocuparse demasiado por su peso y su apariencia física, por lo que desarrolla una relación poco saludable con la comida. Mientras tanto, su amistad con Fernanda empieza a cambiar debido a las inseguridades, los problemas personales y las nuevas experiencias que viven.',
      'La novela muestra las dificultades de crecer, la importancia de la autoestima y el valor de la amistad, además de advertir sobre los peligros de obsesionarse con la apariencia física.'
    ],
    personajes: ['Regina', 'Fernanda', 'Pablo', 'Manolo', 'Pilar']
  },
  {
    id: 'celestina',
    grado: '3.º de secundaria',
    titulo: 'Celestina',
    autor: 'Fernando de Rojas',
    tono: '#7a2233',
    imagen: 'assets/celestina.jpg',
    respaldo: 'assets/celestina.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/5da455933d43bf7823d7a819215be10a2278e41e/ciudad-medieval.svg',
    descripcion: 'Un clásico de la literatura en español sobre el amor, la astucia y las pasiones.',
    sinopsis: 'Calisto, un joven enamorado de Melibea, recurre a Celestina, una alcahueta, para intentar conquistarla. Lo que sigue es una cadena de pasiones, engaños y consecuencias.',
    contexto: 'Obra escrita en la España de finales del siglo XV, conocida como «tragicomedia» y una de las grandes obras de la literatura en lengua española.',
    resumen: [
      'La historia comienza cuando Calisto, un joven noble, se enamora profundamente de Melibea después de conocerla. Como ella no corresponde a sus sentimientos, Calisto recurre a Sempronio, uno de sus criados, quien le recomienda buscar ayuda de Celestina, una anciana experta en hechicería y engaños.',
      'Celestina utiliza sus habilidades para convencer a Melibea de aceptar el amor de Calisto. Sin embargo, la ambición y la codicia provocan conflictos entre los personajes. Cuando Celestina se niega a compartir el dinero que recibe, Sempronio y Pármeno la asesinan. Posteriormente, ambos son castigados. Finalmente, Calisto muere accidentalmente al caer de una escalera y Melibea, desesperada por su pérdida, se suicida.',
      'La obra muestra cómo la codicia, el egoísmo y las pasiones descontroladas pueden conducir a la tragedia.'
    ],
    personajes: ['Calisto', 'Melibea', 'Celestina', 'Pármeno', 'Sempronio', 'Areúsa', 'Elicia']
  },
  {
    id: 'vuelo-condores',
    grado: '4.º de secundaria',
    titulo: 'El Vuelo de los Cóndores',
    autor: 'Abraham Valdelomar',
    tono: '#457b9d',
    imagen: 'assets/vuelo-condores.jpg',
    respaldo: 'assets/vuelo-condores.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/5da455933d43bf7823d7a819215be10a2278e41e/pisco.svg',
    descripcion: 'Un relato conmovedor sobre la infancia, la inocencia, el primer amor y el descubrimiento de la tristeza.',
    sinopsis: 'La historia narra las experiencias de Abraham, un niño que queda cautivado por la llegada de un circo a su pueblo. Allí conoce a Miss Orquídea, una joven trapecista por quien siente una profunda admiración y un cariño especial. Sin embargo, un accidente durante una presentación cambiará su ilusión y despertará en él sentimientos de tristeza.',
    contexto: 'Cuento del escritor peruano Abraham Valdelomar, publicado en 1914. Es una de las obras más representativas del movimiento Colónida y de la narrativa peruana de comienzos del siglo XX.',
    resumen: [
      'La historia es narrada por Abraham, un niño que vive en Pisco y que se emociona al enterarse de la llegada de un circo a su ciudad. Durante una presentación, conoce a una joven artista llamada Miss Orquídea, quien realiza un peligroso número sobre un trapecio.',
      'Sin embargo, durante su actuación, la joven pierde el equilibrio y cae, sufriendo graves heridas. Abraham queda muy impresionado por lo sucedido y comienza a sentir cariño y preocupación por ella. Durante los días siguientes, el niño visita a Miss Orquídea y desarrolla una relación de afecto y ternura.',
      'Cuando finalmente ella se recupera y el circo se marcha, Abraham siente tristeza por su partida. La historia representa la inocencia de la infancia, el primer amor y la sensibilidad de los sentimientos.'
    ],
    personajes: ['Abraham (narrador)', 'Miss Orquídea', 'La madre de Abraham', 'El padre de Abraham', 'Los hermanos de Abraham', 'Los artistas del circo']
  },
  {
    id: 'romeo-julieta',
    grado: '5.º de secundaria',
    titulo: 'Romeo y Julieta',
    autor: 'William Shakespeare',
    tono: '#d62828',
    imagen: 'assets/romeo-julieta.jpg',
    respaldo: 'assets/romeo-julieta.svg',
    lugar: 'https://github.com/PromoBlessed/Cuadro-de-Emociones/blob/5da455933d43bf7823d7a819215be10a2278e41e/verona.svg',
    descripcion: 'Un clásico sobre el amor intenso, la rivalidad entre familias y el peso del destino.',
    sinopsis: 'En Verona, dos familias rivales enfrentan un amor que nace entre Romeo Montesco y Julieta Capuleto. Sus encuentros y decisiones están marcados por la enemistad entre sus casas.',
    contexto: 'Tragedia de William Shakespeare escrita hacia 1595, inspirada en relatos de amor anteriores.',
    resumen: [
      'La historia trata sobre Romeo Montesco y Julieta Capuleto, dos jóvenes pertenecientes a familias enemigas de Verona. A pesar del odio entre sus familias, ambos se enamoran profundamente durante una fiesta y deciden casarse en secreto con la ayuda de Fray Lorenzo.',
      'Sin embargo, los conflictos familiares continúan. Teobaldo, primo de Julieta, mata a Mercucio, amigo de Romeo, y este, en venganza, asesina a Teobaldo. Como consecuencia, Romeo es desterrado de Verona.',
      'Para evitar un matrimonio obligado con otro hombre, Julieta acepta un plan de Fray Lorenzo: tomar una pócima que la hará parecer muerta temporalmente. Pero el mensaje que explica el plan nunca llega a Romeo. Al encontrar a Julieta aparentemente muerta, Romeo bebe un veneno y fallece. Cuando Julieta despierta y descubre lo sucedido, se quita la vida con una daga.',
      'La tragedia termina cuando las familias descubren lo ocurrido y finalmente comprenden las consecuencias de su enemistad.'
    ],
    personajes: ['Romeo Montesco', 'Julieta Capuleto', 'Mercucio', 'Benvolio', 'Teobaldo', 'Fray Lorenzo']
  }
];

// Emociones: no cambiar los id (se guardan en Firestore).
const EMOCIONES = [
  { id: 'alegria',    nombre: 'Alegría',    emoji: '😊', color: '#f6c945' },
  { id: 'tristeza',   nombre: 'Tristeza',   emoji: '😢', color: '#6fa8dc' },
  { id: 'amor',       nombre: 'Amor',       emoji: '❤️', color: '#e06c9f' },
  { id: 'nostalgia',  nombre: 'Nostalgia',  emoji: '🍂', color: '#c08457' },
  { id: 'enojo',      nombre: 'Enojo',      emoji: '😠', color: '#e4572e' },
  { id: 'sorpresa',   nombre: 'Sorpresa',   emoji: '😲', color: '#9b72cf' },
  { id: 'miedo',      nombre: 'Miedo',      emoji: '😨', color: '#4b5d67' },
  { id: 'esperanza',  nombre: 'Esperanza',  emoji: '🌱', color: '#7bc47f' },
  { id: 'admiracion', nombre: 'Admiración', emoji: '🤩', color: '#f29e4c' },
  { id: 'confusion',  nombre: 'Confusión',  emoji: '😕', color: '#a0a4b8' }
];

/* ============================================================
   ESTADO Y UTILIDADES
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const views = { galeria: $('#galeria'), obra: $('#obra') };

// Respaldo solo en memoria (se pierde al recargar). No es almacenamiento permanente.
const respuestasLocales = {};
let desuscribir = null;

/* ============================================================
   GALERÍA
   ============================================================ */

function renderPaleta() {
  $('#paleta').innerHTML = EMOCIONES.map((e, i) =>
    `<span style="background:${e.color};animation-delay:${i * 0.25}s" title="${e.nombre}"></span>`
  ).join('');
}

function renderGaleria() {
  $('#grid').innerHTML = WORKS.map((w, i) => `
    <article class="card" style="--tono:${w.tono};animation-delay:${i * 0.08}s">
      <a class="card-img" href="#${w.id}" aria-label="Explorar ${w.titulo}">
        <img src="${w.imagen}" onerror="this.onerror=null;this.src='${w.respaldo}'" alt="${w.titulo}" loading="lazy">
      </a>
      <img class="lugar" src="${w.lugar}" alt="" aria-hidden="true" loading="lazy">
      <div class="card-body">
        <span class="grado">${w.grado}</span>
        <h2>${w.titulo}</h2>
        <p class="autor">${w.autor}</p>
        <p>${w.descripcion}</p>
        <a class="btn" href="#${w.id}">Explorar obra</a>
      </div>
    </article>`).join('');
}

/* ============================================================
   VISTA DE OBRA Y SELECCIÓN DE EMOCIONES
   ============================================================ */

function renderObra(w) {
  const seleccion = new Set();
  let yaRespondio = false;

  views.obra.innerHTML = `
    <a class="volver" href="#">← Volver a la galería</a>
    <article class="obra" style="--tono:${w.tono}">
      <figure class="obra-img"><img src="${w.imagen}" onerror="this.onerror=null;this.src='${w.respaldo}'" alt="${w.titulo}"></figure>

      <header class="obra-head">
        <span class="grado">${w.grado}</span>
        <h2>${w.titulo}</h2>
        <p class="autor">${w.autor}</p>
      </header>

      <div class="ficha">
        <section class="s-sinopsis"><h3>Sinopsis</h3><p>${w.sinopsis}</p></section>
        <section class="s-contexto"><h3>Contexto</h3><p>${w.contexto}</p></section>
        <section class="s-personajes">
          <h3>Personajes principales</h3>
          <ul class="personajes">${w.personajes.map((p) => `<li>${p}</li>`).join('')}</ul>
        </section>
        <section class="s-resumen">
          <h3>Resumen de la historia</h3>
          ${w.resumen.map((p) => `<p>${p}</p>`).join('')}
        </section>
        <figure class="portada">
          <img src="assets/portadas/${w.id}-portada.jpg" alt="Portada de ${w.titulo}" onerror="this.style.display='none'">
        </figure>
      </div>

      <section class="cuadro">
        <h3>¿Qué emociones despertó esta obra en ti?</h3>
        <p class="sub">Puedes elegir una o varias.</p>
        <div class="emociones">
          ${EMOCIONES.map((e) => `
            <button class="emo" data-id="${e.id}" style="--c:${e.color}" aria-pressed="false">
              <span class="emoji">${e.emoji}</span>${e.nombre}
            </button>`).join('')}
        </div>
        <div class="acciones">
          <button id="confirmar" class="btn btn-primary" disabled>Confirmar selección</button>
        </div>
        <p id="gracias" class="gracias" hidden>Gracias por compartir lo que esta obra despertó en ti.</p>

        <div id="resultados" hidden>
          <h4>Lo que sienten otros visitantes</h4>
          <div id="barras"></div>
          <p class="nota" id="nota"></p>
        </div>
      </section>
    </article>`;

  views.obra.querySelectorAll('.emo').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (yaRespondio) return;
      const id = btn.dataset.id;
      const activar = !seleccion.has(id);
      activar ? seleccion.add(id) : seleccion.delete(id);
      btn.classList.toggle('activo', activar);
      btn.setAttribute('aria-pressed', String(activar));
      $('#confirmar').disabled = seleccion.size === 0;
    });
  });

  $('#confirmar').addEventListener('click', async () => {
    const boton = $('#confirmar');
    boton.disabled = true;
    boton.textContent = 'Guardando…';
    const emociones = [...seleccion];

    try {
      if (isFirebaseReady()) {
        await saveResponse(w.id, emociones);
      } else {
        (respuestasLocales[w.id] ||= []).push(emociones);
      }
    } catch (err) {
      console.error(err);
      boton.disabled = false;
      boton.textContent = 'Confirmar selección';
      alert('No se pudo guardar tu respuesta. Intenta de nuevo.');
      return;
    }

    yaRespondio = true;
    boton.hidden = true;
    views.obra.querySelectorAll('.emo').forEach((b) => (b.disabled = true));
    $('#gracias').hidden = false;
    mostrarResultados(w.id);
  });
}

function mostrarResultados(obraId) {
  $('#resultados').hidden = false;

  if (isFirebaseReady()) {
    desuscribir = subscribeResults(obraId, (conteo, total) =>
      pintarBarras(conteo, total, 'Resultados compartidos y actualizados en tiempo real.'));
  } else {
    const lista = respuestasLocales[obraId] || [];
    const conteo = {};
    lista.forEach((grupo) => grupo.forEach((e) => (conteo[e] = (conteo[e] || 0) + 1)));
    pintarBarras(conteo, lista.length,
      'Modo local: solo se ven las respuestas de esta sesión. Configura Firebase para compartirlas.');
  }
}

function pintarBarras(conteo, total, nota) {
  $('#barras').innerHTML = EMOCIONES.map((e) => {
    const n = conteo[e.id] || 0;
    const pct = total ? Math.round((n * 100) / total) : 0;
    return `
      <div class="barra">
        <span>${e.emoji} ${e.nombre}</span>
        <div class="pista"><div class="relleno" data-pct="${pct}" style="background:${e.color}"></div></div>
        <span class="pct">${pct}%</span>
      </div>`;
  }).join('') + `<p class="total">${total} visitante(s) · porcentaje que eligió cada emoción</p>`;
  $('#nota').textContent = nota;

  // Animación de entrada: primero 0 y luego el porcentaje real.
  requestAnimationFrame(() => {
    document.querySelectorAll('.relleno').forEach((el) => {
      el.style.width = `${el.dataset.pct}%`;
    });
  });
}

/* ============================================================
   NAVEGACIÓN POR HASH (#id de obra; vacío = galería)
   ============================================================ */

function route() {
  if (desuscribir) { desuscribir(); desuscribir = null; }

  const destino = decodeURIComponent(location.hash.slice(1));
  const obra = WORKS.find((w) => w.id === destino);

  Object.values(views).forEach((v) => v.classList.remove('active'));

  if (obra) {
    renderObra(obra);
    views.obra.classList.add('active');
  } else {
    views.galeria.classList.add('active');
  }
  window.scrollTo(0, 0);
}

/* ============================================================
   ARRANQUE
   ============================================================ */

renderPaleta();
renderGaleria();

// Al hacer clic en una tarjeta se muestra su silueta (útil en celulares).
$('#grid').addEventListener('click', (e) => {
  const tarjeta = e.target.closest('.card');
  if (tarjeta) tarjeta.classList.add('tocado');
});

window.addEventListener('hashchange', route);
route();
