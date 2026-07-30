import { db } from "../firebase/app_firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const nombreJugador = document.getElementById("nombreJugador");
const puntajeJugador = document.getElementById("puntajeJugador");

const listaEncontradas = document.getElementById("listaEncontradas");
const listaNoEncontradas = document.getElementById("listaNoEncontradas");

const jugadorRef = ref(db, "Jugadores/" + id);

get(jugadorRef).then((snapshot) => {

    if (!snapshot.exists()) {

        nombreJugador.textContent = "Jugador no encontrado";

        return;

    }

    const jugador = snapshot.val();

    nombreJugador.textContent = jugador.nombre;

    puntajeJugador.textContent =
        `${jugador.puntos} puntos - ${jugador.tiempo}`;

    jugador.resultado.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item.nombre;

        if(item.encontrada){

            li.innerHTML = "✅ " + item.nombre;

            listaEncontradas.appendChild(li);

        }else{

            li.innerHTML = "❌ " + item.nombre;

            listaNoEncontradas.appendChild(li);

        }

    });

});