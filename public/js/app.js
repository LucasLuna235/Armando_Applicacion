import {
    insertarPuntajes,
    esAdmin,
    auth,
    db
} from "../firebase/app_firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// Elementos DOM
const mensajeJuego = document.getElementById('mensajeJuego');
const btn_start = document.getElementById('btn_start');
const velo1 = document.querySelector('.content-block');
const zona = document.getElementById('zona');
const imagen = document.getElementById('ImagenJuego');
const contador = document.getElementById('contador');

// Elementos HUD modernos
const hudUserName = document.getElementById('hudUserName');
const hudUserAvatar = document.getElementById('hudUserAvatar');
const hudUserRole = document.getElementById('hudUserRole');
const hudPuntos = document.getElementById('hudPuntos');
const hudHallazgos = document.getElementById('hudHallazgos');
const progressBarFill = document.getElementById('progressBarFill');
const progressPercent = document.getElementById('progressPercent');
const btnCambiarRol = document.getElementById('btnCambiarRol');

// Modales
const modalRol = document.getElementById('modalRol');
const btnConfirmarRol = document.getElementById('btnConfirmarRol');
const modalFinPartida = document.getElementById('modalFinPartida');
const finPuntos = document.getElementById('finPuntos');
const finHallazgos = document.getElementById('finHallazgos');
const finTiempo = document.getElementById('finTiempo');
const inputNombreJugador = document.getElementById('inputNombreJugador');
const btnGuardarPuntaje = document.getElementById('btnGuardarPuntaje');
const btnReintentar = document.getElementById('btnReintentar');

// Email Admin
export const ADMIN_EMAIL = "lukitaass2013@gmail.com";

let juegoActivo = false;
let intervalo;

let tiempo = 300;
let tiempoInicial = 300;
let tiempoRol = "5 minutos";

let encontradas = 0;
let puntaje = 0;
let rolUsuario = "ayudante";
let rolLabel = "Ayudante / Medio Oficial";

// 35 Condiciones y Actos Subestándar
let diferencias = [
    // Condiciones subestandar 
    { nombre: "Tacho sin tapa", x:10.7, y:75.2, encontrada:false, puntos:10},
    { nombre: "RSU Desparramados", x:10.7, y:91.1, encontrada:false, puntos:10},
    { nombre: "Tacho sin identificar con RSU mezclados", x:10.7, y:82.2, encontrada:false, puntos:10},
    { nombre: "Tacho Rebalsado p/RSU Rebalsado", x:14.3, y:72.4, encontrada:false, puntos:10},
    { nombre: "Cajas mal apiladas", x:14.3, y:58.4, encontrada:false, puntos:10},
    { nombre: "Escalera quebrada y atada", x:35.6, y:38.7, encontrada:false, puntos:10},
    { nombre: "Escalera emparchada", x:32.5, y:42.1, encontrada:false, puntos:10},
    { nombre: "Falta pata anti deslizante", x:35.6, y:59.6, encontrada:false, puntos:10},
    { nombre: "No uso de guantes agarrado a madera", x:32.2, y:20.8, encontrada:false, puntos:10},
    { nombre: "Falta mampara para soldadura", x:42.9, y:44.2, encontrada:false, puntos:10},
    { nombre: "Falta cabina anti vuelco", x:57.7, y:42.7, encontrada:false, puntos:10},
    { nombre: "Bidón sin tapa emanando gases", x:35.8, y:89.3, encontrada:false, puntos:10},
    { nombre: "Tanque de combustible sin identificar", x:42.8, y:88.3, encontrada:false, puntos:10},
    { nombre: "Derrame de aceite", x:56, y:90.6, encontrada:false, puntos:10},
    { nombre: "Variación por no centrar la pieza", x:68.2, y:66.9, encontrada:false, puntos:10},
    { nombre: "Proyecciones por alta velocidad", x:80.7, y:65.1, encontrada:false, puntos:10},
    { nombre: "Escalón roto", x:35.1, y:46.4, encontrada:false, puntos:10},
    { nombre: "Sótano abierto y sin iluminación", x:85.3, y:53.6, encontrada:false, puntos:10},
    { nombre: "Escalera corta, debe salir más de un metro", x:93, y:52.6, encontrada:false, puntos:10},
    { nombre: "Falta extintor", x:61.4, y:48.6, encontrada:false, puntos:10},
    { nombre: "Soldando en charco de agua", x:39.1, y:42.7, encontrada:false, puntos:10},
    { nombre: "Tabla con clavos hacia arriba (1)", x:83.8, y:41.2, encontrada:false, puntos:10},
    { nombre: "Tabla con clavos hacia arriba (2)", x:88.7, y:40.9, encontrada:false, puntos:10},
    { nombre: "Tabla con clavos hacia arriba (3)", x:85.7, y:45.6, encontrada:false, puntos:10},
    { nombre: "Falta de barandas hacia el sótano", x:89.7, y:57.9, encontrada:false, puntos:10},
    { nombre: "Polea sin protección", x:87.7, y:15, encontrada:false, puntos:10},
    { nombre: "Eje sin protección mecánica", x:86, y:5.5, encontrada:false, puntos:10},
    { nombre: "Barras a la vista con EE", x:66.6, y:7.7, encontrada:false, puntos:10},
    { nombre: "Barras expuestas con EE", x:61.2, y:7.7, encontrada:false, puntos:10},
    { nombre: "Tablero eléctrico con EE abierto sin DD", x:61.2, y:18.7, encontrada:false, puntos:10},
    { nombre: "Falta cartel de RIESGO ELÉCTRICO", x:70.1, y:18.7, encontrada:false, puntos:10},
    { nombre: "Faltan carteles de USO OBLIGADO EPP", x:51.7, y:9, encontrada:false, puntos:10},
    { nombre: "Cadena del aparejo atada con hilo", x:46.3, y:9, encontrada:false, puntos:10},
    { nombre: "Gancho sin seguro de traba", x:46.7, y:18.7, encontrada:false, puntos:10},
    { nombre: "Carga larga tomada de un solo punto", x:50.9, y:28, encontrada:false, puntos:10}
];

// Iniciar sesión y sincronizar usuario
auth.onAuthStateChanged((user) => {
    if (user) {
        if (hudUserName) hudUserName.textContent = user.displayName || user.email.split('@')[0];
        if (hudUserAvatar) {
            if (user.photoURL) {
                hudUserAvatar.innerHTML = `<img src="${user.photoURL}" alt="avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                hudUserAvatar.textContent = (user.displayName || user.email)[0].toUpperCase();
            }
        }
        if (inputNombreJugador && (!inputNombreJugador.value || inputNombreJugador.value === '')) {
            inputNombreJugador.value = user.displayName || user.email.split('@')[0];
        }
    }
});

// GESTIÓN DEL MODAL DE ROL
function abrirModalRol() {
    if (modalRol) modalRol.classList.add('active');
}

function cerrarModalRol() {
    if (modalRol) modalRol.classList.remove('active');
}

// Configurar selección de rol
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar opciones de rol
    const roleCards = document.querySelectorAll('.role-option-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            rolUsuario = card.getAttribute('data-role');
            tiempo = parseInt(card.getAttribute('data-time'), 10);
            tiempoInicial = tiempo;
            rolLabel = card.getAttribute('data-label');
            
            if (tiempo === 300) tiempoRol = "5 minutos";
            else if (tiempo === 180) tiempoRol = "3 minutos";
            else if (tiempo === 60) tiempoRol = "1 minuto";
            else tiempoRol = `${Math.floor(tiempo / 60)} minutos`;
        });
    });

    // Seleccionar por defecto el primero
    if (roleCards.length > 0) {
        roleCards[0].classList.add('selected');
        rolUsuario = roleCards[0].getAttribute('data-role');
        tiempo = parseInt(roleCards[0].getAttribute('data-time'), 10);
        tiempoInicial = tiempo;
        rolLabel = roleCards[0].getAttribute('data-label');
        tiempoRol = "5 minutos";
    }

    if (btnConfirmarRol) {
        btnConfirmarRol.addEventListener('click', () => {
            cerrarModalRol();
            actualizarHUD();
            mostrarMensaje(`Rol asignado: <strong>${rolLabel}</strong><br>Tiempo: ${tiempoRol}`);
        });
    }

    if (btnCambiarRol) {
        btnCambiarRol.addEventListener('click', () => {
            if (juegoActivo) {
                if (confirm("¿Deseas reiniciar la partida para cambiar de rol?")) {
                    detenerJuego();
                    abrirModalRol();
                }
            } else {
                abrirModalRol();
            }
        });
    }

    // Abrir modal de rol al inicio si no ha comenzado
    abrirModalRol();
    actualizarHUD();
});

// CLIC EN VELO ANTES DE COMENZAR
if (velo1) {
    velo1.addEventListener('click', (e) => {
        if (!juegoActivo && e.target !== btn_start && !btn_start.contains(e.target)) {
            mostrarMensaje(`
                ⚠️ LA EVALUACIÓN NO HA COMENZADO
                <br>
                Presiona <strong>Comenzar Evaluación</strong> para iniciar el cronómetro
            `);
        }
    });
}

// BOTÓN START
if (btn_start) {
    btn_start.addEventListener('click', (e) => {
        e.stopPropagation();
        iniciarJuego();
    });
}

// CLIC EN LA IMAGEN DE RIESGOS
if (imagen) {
    imagen.addEventListener('click', cargaApp);
}

// INICIAR EL JUEGO
function iniciarJuego() {
    if (juegoActivo) return;

    juegoActivo = true;
    tiempo = tiempoInicial;

    if (velo1) {
        velo1.classList.add('oculto');
    }

    actualizarContador();
    actualizarHUD();

    mostrarMensaje(`🚀 ¡Evaluación iniciada! Encuentra las 35 condiciones y actos inseguros.`);

    intervalo = setInterval(() => {
        tiempo--;
        actualizarContador();

        if (tiempo <= 0) {
            clearInterval(intervalo);
            juegoActivo = false;

            if (velo1) {
                velo1.classList.remove('oculto');
            }

            finalizarEvaluacion(false);
        }
    }, 1000);
}

function detenerJuego() {
    clearInterval(intervalo);
    juegoActivo = false;
    tiempo = tiempoInicial;
    encontradas = 0;
    puntaje = 0;
    diferencias.forEach(d => d.encontrada = false);
    document.querySelectorAll('.marca').forEach(m => m.remove());
    if (velo1) velo1.classList.remove('oculto');
    actualizarContador();
    actualizarHUD();
}

// DETECCIÓN DE CLIC EN RIESGOS
function cargaApp(e) {
    if (!juegoActivo) return;

    let rect = imagen.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    let acierto = false;

    for (let i = 0; i < diferencias.length; i++) {
        let dif = diferencias[i];

        if (!dif.encontrada) {
            let distancia = Math.sqrt(
                Math.pow(x - dif.x, 2) +
                Math.pow(y - dif.y, 2)
            );

            if (distancia < 5.2) {
                dif.encontrada = true;
                marcar(dif.x, dif.y);
                encontradas++;
                puntaje += dif.puntos;
                acierto = true;

                actualizarHUD();
                mostrarMensaje(`✅ <strong>+10 pts:</strong> ${dif.nombre}`);

                // Si encuentra todas
                if (encontradas === diferencias.length) {
                    clearInterval(intervalo);
                    juegoActivo = false;
                    finalizarEvaluacion(true);
                }
                break;
            }
        }
    }
}

// COLOCAR MARCADOR VISUAL
function marcar(x, y) {
    let marca = document.createElement("div");
    marca.classList.add("marca");
    marca.style.left = x + "%";
    marca.style.top = y + "%";
    zona.appendChild(marca);
}

// ACTUALIZAR CRONÓMETRO
function actualizarContador() {
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    if (contador) {
        contador.innerHTML = `⏰ ${minutos}:${segundos}`;

        // Alertas visuales de tiempo
        contador.classList.remove('timer-warning', 'timer-critical');
        if (tiempo <= 20) {
            contador.classList.add('timer-critical');
        } else if (tiempo <= 60) {
            contador.classList.add('timer-warning');
        }
    }
}

// ACTUALIZAR ESTADO DEL HUD
function actualizarHUD() {
    if (hudPuntos) hudPuntos.textContent = `${puntaje} pts`;
    if (hudHallazgos) hudHallazgos.textContent = `${encontradas} / ${diferencias.length}`;
    if (hudUserRole) hudUserRole.textContent = `Rol: ${rolLabel}`;

    const pct = Math.round((encontradas / diferencias.length) * 100);
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;

    // Mantener compatibilidad con selectores previos
    let contentPuntos = document.querySelector('.content-puntos');
    if (contentPuntos) {
        contentPuntos.innerHTML = `⭐ ${puntaje} puntos | ✅ ${encontradas}/${diferencias.length}`;
    }
}

// FINALIZAR EVALUACIÓN Y MOSTRAR MODAL
function finalizarEvaluacion(completado) {
    let tiempoGastado = tiempoInicial - tiempo;
    let minutos = Math.floor(tiempoGastado / 60);
    let segundos = tiempoGastado % 60;
    segundos = segundos < 10 ? "0" + segundos : segundos;
    let tiempoUsado = `${minutos}:${segundos}`;

    if (finPuntos) finPuntos.textContent = `${puntaje} pts`;
    if (finHallazgos) finHallazgos.textContent = `${encontradas} / ${diferencias.length}`;
    if (finTiempo) finTiempo.textContent = tiempoUsado;

    const modalFinIcon = document.getElementById('modalFinIcon');
    const modalFinTitulo = document.getElementById('modalFinTitulo');
    const modalFinSubtitulo = document.getElementById('modalFinSubtitulo');

    if (completado) {
        if (modalFinIcon) modalFinIcon.textContent = "🏆";
        if (modalFinTitulo) modalFinTitulo.textContent = "¡Felicitaciones! Detección Completa";
        if (modalFinSubtitulo) modalFinSubtitulo.textContent = "Has encontrado los 35 riesgos antes del límite de tiempo.";
    } else {
        if (modalFinIcon) modalFinIcon.textContent = "⏱️";
        if (modalFinTitulo) modalFinTitulo.textContent = "Tiempo Agotado";
        if (modalFinSubtitulo) modalFinSubtitulo.textContent = "Buen trabajo. Registra tu avance para la tabla de clasificación.";
    }

    if (modalFinPartida) {
        modalFinPartida.classList.add('active');
    }
}

// BOTÓN GUARDAR PUNTAJE EN FIREBASE
if (btnGuardarPuntaje) {
    btnGuardarPuntaje.addEventListener('click', async () => {
        let nombre = inputNombreJugador ? inputNombreJugador.value.trim() : "";
        if (!nombre) {
            alert("Por favor, ingresa tu nombre para registrar la evaluación.");
            if (inputNombreJugador) inputNombreJugador.focus();
            return;
        }

        btnGuardarPuntaje.disabled = true;
        btnGuardarPuntaje.textContent = "Guardando...";

        let tiempoGastado = tiempoInicial - tiempo;
        let minutos = Math.floor(tiempoGastado / 60);
        let segundos = tiempoGastado % 60;
        segundos = segundos < 10 ? "0" + segundos : segundos;
        let tiempoUsado = `${minutos}:${segundos}`;

        const resultadoFinal = diferencias.map(d => ({
            nombre: d.nombre,
            encontrada: d.encontrada
        }));

        try {
            await insertarPuntajes(nombre, puntaje, tiempoUsado, tiempoRol, rolUsuario, resultadoFinal);
            window.location.href = "../pages/puntos.html";
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar los puntajes. Redirigiendo a rankings.");
            window.location.href = "../pages/puntos.html";
        }
    });
}

// BOTÓN REINTENTAR
if (btnReintentar) {
    btnReintentar.addEventListener('click', () => {
        if (modalFinPartida) modalFinPartida.classList.remove('active');
        detenerJuego();
    });
}

// NOTIFICACIÓN FLOTANTE (TOAST)
let toastTimeout;
export function mostrarMensaje(texto) {
    if (!mensajeJuego) return;
    mensajeJuego.innerHTML = texto;
    mensajeJuego.classList.add('activo');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        mensajeJuego.classList.remove('activo');
    }, 2800);
}