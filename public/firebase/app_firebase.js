// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";


// CONFIG
export const firebaseConfig = {

  apiKey: "AIzaSyDQR1HeedFNGuP6R8ptU0P1PMSQJoXmRAM",

  authDomain: "armando-app-7ae85.firebaseapp.com",

  projectId: "armando-app-7ae85",

  storageBucket: "armando-app-7ae85.firebasestorage.app",

  messagingSenderId: "48893759586",

  appId: "1:48893759586:web:a8d51b2d0e77a2b703813b",

  measurementId: "G-QP9JR9YKS5"

};


// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);


// ANALYTICS
try {

  getAnalytics(app);

} catch (error) {

  console.log("Analytics no disponible");

}


// AUTH Y DATABASE
export const auth = getAuth(app);

export const db = getDatabase(app);

const provider = new GoogleAuthProvider();


// LOGIN
const btn_login = document.querySelector(".btn_login");

if (btn_login) {

  btn_login.addEventListener("click", signInWithGoogle);

}


// LOGIN GOOGLE
function signInWithGoogle() {

  signInWithPopup(auth, provider)

    .then((result) => {

      console.log("Login correcto:", result.user);

      window.location.href = "./pages/app.html";

    })

    .catch((error) => {

      console.error("Error login:", error);

    });

}


// LOGOUT
const btn_close = document.querySelector(".btn_close");

if (btn_close) {

  btn_close.addEventListener("click", cerrarSesion);

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


// GUARDAR PUNTAJES
export async function insertarPuntajes(nombre, encontradas, tiempoUsado, tiempoRol, rolUsuario){

  try {

    const user = auth.currentUser;

    if (!user) {

      console.log("No hay usuario logueado");

      return;

    }

    const tiempoFinal = tiempoUsado;

    const nuevoJugador = push(ref(db, "Jugadores"));

    await set(nuevoJugador, {

      uid: user.uid,

      email: user.email,

      nombre: nombre,

      puntos: encontradas,

      tiempo: tiempoFinal,
 
      tiempoRol: tiempoRol,

      rolUsuario: rolUsuario,

      fecha: new Date().toLocaleString()

    });

    console.log("Puntajes guardados");

  } catch (error) {

    console.log("Error al guardar los puntajes:", error);

  }

}


// OBTENER PUNTAJES
export function obtenerPuntajes(callback) {

  const jugadoresRef = ref(db, "Jugadores");

  onValue(jugadoresRef, (snapshot) => {

    const datos = snapshot.val();

    if (!datos) {

      callback([]);

      return;

    }

    let jugadores = [];

    for (let id in datos) {

      jugadores.push(datos[id]);

    }

    jugadores.sort((a, b) => b.puntos - a.puntos);

    callback(jugadores);

  });

}


// BOTON RESET DB
const btnDeletDb = document.getElementById("btnReset");

if (btnDeletDb) {

  btnDeletDb.addEventListener("click", reseteadb);

}


// BORRAR DATABASE
async function reseteadb() {

  const clave = "ArmandoGuanco";

  const data = prompt("Ingrese la clave para borrar los datos:");

  if (data === clave) {

    try {

      await remove(ref(db, "Jugadores"));

      alert("Base de datos limpiada correctamente");

    } catch (error) {

      console.log("Error al borrar:", error);

    }

  } else {

    alert("Clave incorrecta");

  }

}


// VERIFICAR ADMIN
export  function esAdmin(user) {
    if(!user) return false;

    return user.email === "lukitaass2013@gmail.com" || "armandodelaplataguanco@gmail.com";
  
}