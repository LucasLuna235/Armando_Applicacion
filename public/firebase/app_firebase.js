// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import{
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { getAnalytics }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";

import {mostrarMensaje} from "../assets/app.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyDQR1HeedFNGuP6R8ptU0P1PMSQJoXmRAM",
  authDomain: "armando-app-7ae85.firebaseapp.com",
  projectId: "armando-app-7ae85",
  storageBucket: "armando-app-7ae85.firebasestorage.app",
  messagingSenderId: "48893759586",
  appId: "1:48893759586:web:a8d51b2d0e77a2b703813b",
  measurementId: "G-QP9JR9YKS5"
};

// Init
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getDatabase(app);


// LOGIN
const btn_login = document.querySelector('.btn_login');

if (btn_login) {
  btn_login.addEventListener('click', signInWithGoogle);
}
// Logeuearse con google
function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Login correcto:", result.user);
      window.location.href = "./pages/app.html";
    })
    .catch((error) => {
      console.error("Error login:", error.message);
    });
}


// export async function esAdmin(usuario){
//     const email = usuario.email
//         .replace(/\./g, ",");

//     const adminRef = ref(db, "admins/" + email);

//     const snapshot = await get(adminRef);

//     return snapshot.exists();
// }


// auth.onAuthStateChanged(async(user)=>{

//     if(user){

//         const admin = await esAdmin(user);

//         const tablaPuntos = document.querySelector(".content-puntos");

//         if(admin){

//             tablaPuntos.style.display = "block";

//             console.log("Administrador");

//         }else{

//             tablaPuntos.style.display = "none";

//             console.log("Usuario normal");
//         }
//     }
// });


// LOGOUT
const btn_close = document.querySelector('.btn_close');

if (btn_close) {
  btn_close.addEventListener('click', cerrarSesion);
}

function cerrarSesion() {
  signOut(auth)
    .then(() => {
      console.log("Sesión cerrada");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
}

// Guardar puntajes
export function insertarPuntajes(nombre,encontradas){

    let tiempoFinal = "5:00";
    const nuevoJugador = push(ref(db,"Jugadores"));

    set(nuevoJugador,{
        id: Date.now(),
        nombre: nombre,
        puntos: encontradas,
        tiempo: tiempoFinal
    })
    .then(()=>{
      console.log('Puntajes guardados');
    })

    .catch((error)=>{
      console.log('Error al guardar los puntajes: ',error);
    });
      
}

export function obtenerPuntajes(callback){

    const jugadoresRef = ref(db, "Jugadores");

    onValue(jugadoresRef, (snapshot)=>{

        let datos = snapshot.val();

        let jugadores = [];

        for(let id in datos){

            jugadores.push(datos[id]);
        }

        // 🔥 ordenar mayor puntaje
        jugadores.sort((a,b)=> b.puntos - a.puntos);

        callback(jugadores);

    });
}

let btnDeletDb = document.getElementById('btnReset');

if(btnDeletDb){

    btnDeletDb.addEventListener('click',reseteadb);

}

function reseteadb(){
  let clave = "ArmandoGuanco";
  let data = "";

  data = prompt("ingrese la clave para poder borrar los datos: ");
  if(data === clave){
    remove(ref(db, "Jugadores"));
    mostrarMensaje('Base de datos limpiada correctamente');      
  }else{
    alert("Clave incorrecta");
  }

}



