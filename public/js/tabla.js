import { auth, db, esAdmin } from "../firebase/app_firebase.js";

import {
    ref,
    onValue
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";


const tabla = document.getElementById("tablaPuntos");

const btn_reset = document.getElementById("btnReset");


auth.onAuthStateChanged(async(user)=>{

    if(!user) return;

    const admin = esAdmin(user);

    // BOTON RESET SOLO ADMIN
    if(btn_reset){

        btn_reset.style.display =
        admin ? "block" : "none";

    }

    const jugadoresRef = ref(db,"Jugadores");

    onValue(jugadoresRef,(snapshot)=>{

        if(!tabla) return;

        tabla.innerHTML = "";

        const datos = snapshot.val();

        if(!datos){

            tabla.innerHTML =
            `<p>No hay puntajes registrados</p>`;

            return;

        }

        for(let id in datos){

            const jugador = datos[id];

            // ADMIN VE TODO
            if(admin){

                tabla.innerHTML += `

                    <tr class="card-puntos">
                        
                        <td><a href="../pages/descripcion.html?id=${id}">${jugador.nombre}</a></td>

                        <td>📅 ${jugador.rolUsuario}</td>

                        <td>⭐ ${jugador.puntos} puntos</td>

                        <td>📅 ${jugador.tiempo}</td>
                        
                        <td>📅 ${jugador.tiempoRol}</td>

                        <td>📅 ${jugador.fecha}</td>
                        

                    </tr>
                    
                `;

            }

            // USUARIO NORMAL SOLO SUS DATOS
            else if(jugador.uid === user.uid){

                tabla.innerHTML += `

                    <tr class="card-puntos">
                        
                        <td>${jugador.nombre}</td>
                        <td>📅 ${jugador.rolUsuario}</td>
                        <td>⭐ ${jugador.puntos} puntos</td>
                        <td>📅 ${jugador.tiempoRol}</td>
                        <td>${jugador.tiempo}</td>
                        <td>📅 ${jugador.fecha}</td>
                        
                    </tr>

                `;

            }

        }

    });

});