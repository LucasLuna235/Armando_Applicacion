import { obtenerPuntajes } from "../firebase/app_firebase.js";

const tabla = document.getElementById("tablaPuntos");

obtenerPuntajes((jugadores)=>{

    tabla.innerHTML = "";

    jugadores.forEach((jugador)=>{

        tabla.innerHTML +=
        `
        <tr>
            <td>${jugador.id}</td>
            <td>${jugador.nombre}</td>
            <td>${jugador.puntos}</td>
            <td>${jugador.tiempo}</td>
        </tr>
        `;
    });

});