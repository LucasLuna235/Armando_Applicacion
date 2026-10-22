import { db } from "../firebase/app_firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const nombreJugador = document.getElementById("nombreJugador");
const playerSubtitle = document.getElementById("playerSubtitle");
const playerAvatar = document.getElementById("playerAvatar");
const puntajeValor = document.getElementById("puntajeValor");
const hallazgosValor = document.getElementById("hallazgosValor");
const efectividadValor = document.getElementById("efectividadValor");
const tiempoValor = document.getElementById("tiempoValor");
const countEncontradas = document.getElementById("countEncontradas");
const countNoEncontradas = document.getElementById("countNoEncontradas");
const puntajeJugador = document.getElementById("puntajeJugador");

const listaEncontradas = document.getElementById("listaEncontradas");
const listaNoEncontradas = document.getElementById("listaNoEncontradas");
const btnDescargar = document.getElementById("btnDescargarReporte");

if (!id) {
    if (nombreJugador) nombreJugador.textContent = "Evaluación no especificada";
    if (playerSubtitle) playerSubtitle.textContent = "Regresa a la tabla de rankings y selecciona una evaluación.";
} else {
    const jugadorRef = ref(db, "Jugadores/" + id);

    get(jugadorRef).then((snapshot) => {
        if (!snapshot.exists()) {
            if (nombreJugador) nombreJugador.textContent = "Evaluación no encontrada";
            if (playerSubtitle) playerSubtitle.textContent = "El registro solicitado no existe en la base de datos.";
            return;
        }

        const jugador = snapshot.val();

        if (nombreJugador) nombreJugador.textContent = jugador.nombre || "Evaluador";
        if (playerAvatar) {
            const inicial = (jugador.nombre || "E")[0].toUpperCase();
            playerAvatar.textContent = inicial;
        }

        const rolText = jugador.rolUsuario ? `Rol: ${jugador.rolUsuario.toUpperCase()}` : "Rol General";
        const fechaText = jugador.fecha ? ` &bull; Fecha: ${jugador.fecha}` : "";
        if (playerSubtitle) playerSubtitle.innerHTML = `${rolText}${fechaText}`;

        // Puntajes y métricas
        const totalPuntos = jugador.puntos || 0;
        if (puntajeValor) puntajeValor.textContent = `${totalPuntos} pts`;

        if (puntajeJugador) {
            puntajeJugador.textContent = `${totalPuntos} puntos - ${jugador.tiempo || ""}`;
        }

        if (tiempoValor) {
            tiempoValor.textContent = `${jugador.tiempo || "-"} (de ${jugador.tiempoRol || "-"})`;
        }

        let encontradasCount = 0;
        let noEncontradasCount = 0;

        if (listaEncontradas) listaEncontradas.innerHTML = "";
        if (listaNoEncontradas) listaNoEncontradas.innerHTML = "";

        if (jugador.resultado && Array.isArray(jugador.resultado)) {
            jugador.resultado.forEach(item => {
                const li = document.createElement("li");

                if (item.encontrada) {
                    encontradasCount++;
                    li.innerHTML = `<span>✅</span> <strong>${item.nombre}</strong>`;
                    if (listaEncontradas) listaEncontradas.appendChild(li);
                } else {
                    noEncontradasCount++;
                    li.innerHTML = `<span>❌</span> <span>${item.nombre}</span>`;
                    if (listaNoEncontradas) listaNoEncontradas.appendChild(li);
                }
            });

            const total = encontradasCount + noEncontradasCount;
            if (hallazgosValor) hallazgosValor.textContent = `${encontradasCount} / ${total}`;

            const porcentaje = total > 0 ? Math.round((encontradasCount / total) * 100) : 0;
            if (efectividadValor) {
                efectividadValor.textContent = `${porcentaje}%`;
                if (porcentaje >= 80) efectividadValor.style.color = "#34d399";
                else if (porcentaje >= 50) efectividadValor.style.color = "#fbbf24";
                else efectividadValor.style.color = "#f87171";
            }
        }

        if (countEncontradas) countEncontradas.textContent = encontradasCount;
        if (countNoEncontradas) countNoEncontradas.textContent = noEncontradasCount;

        if (encontradasCount === 0 && listaEncontradas) {
            listaEncontradas.innerHTML = `<li style="color: var(--text-muted); border: none;">No se registraron hallazgos en esta evaluación.</li>`;
        }

        if (noEncontradasCount === 0 && listaNoEncontradas) {
            listaNoEncontradas.innerHTML = `<li style="color: #34d399; border: none;">¡Excelente! Se detectaron el 100% de los riesgos.</li>`;
        }
    }).catch(err => {
        console.error("Error al obtener datos:", err);
        if (nombreJugador) nombreJugador.textContent = "Error al cargar la evaluación";
    });
}

// DESCARGAR REPORTE CON HTML2CANVAS
if (btnDescargar) {
    btnDescargar.addEventListener("click", () => {
        const reportElement = document.getElementById("reportContent");
        if (!reportElement) return;

        btnDescargar.disabled = true;
        btnDescargar.textContent = "Generando imagen...";

        if (typeof html2canvas === "function") {
            html2canvas(reportElement, {
                backgroundColor: "#0b0f19",
                scale: 2,
                useCORS: true
            }).then(canvas => {
                const link = document.createElement("a");
                const nombreSeguro = (nombreJugador.textContent || "evaluacion").replace(/\s+/g, "_");
                link.download = `CMASS_Evaluacion_${nombreSeguro}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                btnDescargar.disabled = false;
                btnDescargar.textContent = "📥 Descargar Comprobante (PNG)";
            }).catch(err => {
                console.error("Error al generar imagen:", err);
                alert("No se pudo generar la imagen del reporte.");
                btnDescargar.disabled = false;
                btnDescargar.textContent = "📥 Descargar Comprobante (PNG)";
            });
        } else {
            alert("Librería de captura no disponible.");
            btnDescargar.disabled = false;
            btnDescargar.textContent = "📥 Descargar Comprobante (PNG)";
        }
    });
}