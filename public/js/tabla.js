import { auth, db, esAdmin } from "../firebase/app_firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const tabla = document.getElementById("tablaPuntos");
const btn_reset = document.getElementById("btnReset");
const inputBuscar = document.getElementById("inputBuscar");

// Podio DOM
const podiumContainer = document.getElementById("podiumTop3");
const podiumFirst = document.getElementById("podiumFirst");
const podiumFirstName = document.getElementById("podiumFirstName");
const podiumFirstRole = document.getElementById("podiumFirstRole");
const podiumFirstScore = document.getElementById("podiumFirstScore");

const podiumSecond = document.getElementById("podiumSecond");
const podiumSecondName = document.getElementById("podiumSecondName");
const podiumSecondRole = document.getElementById("podiumSecondRole");
const podiumSecondScore = document.getElementById("podiumSecondScore");

const podiumThird = document.getElementById("podiumThird");
const podiumThirdName = document.getElementById("podiumThirdName");
const podiumThirdRole = document.getElementById("podiumThirdRole");
const podiumThirdScore = document.getElementById("podiumThirdScore");

let listadoJugadores = [];
let usuarioEsAdmin = false;
let usuarioActual = null;

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        if (tabla) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div class="empty-state-icon">🔒</div>
                        <p>Debes iniciar sesión para consultar los puntajes.</p>
                        <a href="../index.html" class="btn btn-primary" style="margin-top: 12px;">Ir a Iniciar Sesión</a>
                    </td>
                </tr>
            `;
        }
        return;
    }

    usuarioActual = user;
    usuarioEsAdmin = esAdmin(user);

    // BOTON RESET SOLO ADMIN
    if (btn_reset) {
        btn_reset.style.display = usuarioEsAdmin ? "inline-flex" : "none";
    }

    const jugadoresRef = ref(db, "Jugadores");

    onValue(jugadoresRef, (snapshot) => {
        if (!tabla) return;

        const datos = snapshot.val();
        listadoJugadores = [];

        if (!datos) {
            if (podiumContainer) podiumContainer.style.display = "none";
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>Aún no hay evaluaciones registradas en el sistema.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Convertir objeto en arreglo con sus keys (id)
        for (let id in datos) {
            listadoJugadores.push({
                id: id,
                ...datos[id]
            });
        }

        // Ordenar de mayor puntaje a menor
        listadoJugadores.sort((a, b) => {
            const ptsA = Number(a.puntos) || 0;
            const ptsB = Number(b.puntos) || 0;
            return ptsB - ptsA;
        });

        // Actualizar podio
        actualizarPodio(listadoJugadores);

        // Renderizar tabla con filtro si hay búsqueda
        renderizarTabla(listadoJugadores);
    });
});

// FUNCIÓN PARA RENDERIZAR TABLA CON FILTRO
function renderizarTabla(lista) {
    if (!tabla) return;
    tabla.innerHTML = "";

    const query = inputBuscar ? inputBuscar.value.trim().toLowerCase() : "";

    const filtrados = lista.filter(jugador => {
        // Si no es admin y no es su registro, omitir
        if (!usuarioEsAdmin && jugador.uid !== usuarioActual.uid) {
            return false;
        }

        if (!query) return true;
        const nombre = (jugador.nombre || "").toLowerCase();
        const rol = (jugador.rolUsuario || "").toLowerCase();
        return nombre.includes(query) || rol.includes(query);
    });

    if (filtrados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>No se encontraron registros que coincidan con la búsqueda.</p>
                </td>
            </tr>
        `;
        return;
    }

    filtrados.forEach((jugador, index) => {
        let posicionBadge = `#${index + 1}`;
        if (index === 0) posicionBadge = "🥇 1º";
        else if (index === 1) posicionBadge = "🥈 2º";
        else if (index === 2) posicionBadge = "🥉 3º";

        const nombreHtml = usuarioEsAdmin 
            ? `<a href="../pages/descripcion.html?id=${jugador.id}" title="Ver informe detallado">${jugador.nombre || "Sin nombre"} ↗</a>`
            : `<span>${jugador.nombre || "Sin nombre"}</span>`;

        const tr = document.createElement("tr");
        if (index === 0) tr.classList.add("rank-1");
        else if (index === 1) tr.classList.add("rank-2");
        else if (index === 2) tr.classList.add("rank-3");

        tr.innerHTML = `
            <td style="font-weight: 700;">${posicionBadge}</td>
            <td>${nombreHtml}</td>
            <td><span class="badge-role">${jugador.rolUsuario || "General"}</span></td>
            <td><span class="badge-points">${jugador.puntos || 0} pts</span></td>
            <td><span class="badge-time">⏱️ ${jugador.tiempo || "-"}</span></td>
            <td><span class="badge-time">${jugador.tiempoRol || "-"}</span></td>
            <td style="font-size: 0.8rem; color: var(--text-muted);">${jugador.fecha || "-"}</td>
        `;

        tabla.appendChild(tr);
    });
}

// ACTUALIZAR PODIO TOP 3
function actualizarPodio(lista) {
    if (!podiumContainer) return;

    if (lista.length === 0) {
        podiumContainer.style.display = "none";
        return;
    }

    podiumContainer.style.display = "grid";

    // Primero
    if (lista[0]) {
        if (podiumFirstName) podiumFirstName.textContent = lista[0].nombre || "Anónimo";
        if (podiumFirstRole) podiumFirstRole.textContent = lista[0].rolUsuario || "-";
        if (podiumFirstScore) podiumFirstScore.textContent = `${lista[0].puntos || 0} pts`;
    }

    // Segundo
    if (lista[1]) {
        if (podiumSecond) podiumSecond.style.visibility = "visible";
        if (podiumSecondName) podiumSecondName.textContent = lista[1].nombre || "Anónimo";
        if (podiumSecondRole) podiumSecondRole.textContent = lista[1].rolUsuario || "-";
        if (podiumSecondScore) podiumSecondScore.textContent = `${lista[1].puntos || 0} pts`;
    } else {
        if (podiumSecond) podiumSecond.style.visibility = "hidden";
    }

    // Tercero
    if (lista[2]) {
        if (podiumThird) podiumThird.style.visibility = "visible";
        if (podiumThirdName) podiumThirdName.textContent = lista[2].nombre || "Anónimo";
        if (podiumThirdRole) podiumThirdRole.textContent = lista[2].rolUsuario || "-";
        if (podiumThirdScore) podiumThirdScore.textContent = `${lista[2].puntos || 0} pts`;
    } else {
        if (podiumThird) podiumThird.style.visibility = "hidden";
    }
}

// Búsqueda en vivo
if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        renderizarTabla(listadoJugadores);
    });
}