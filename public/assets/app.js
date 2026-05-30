    // import { insertarPuntajes } from "../firebase/app_firebase.js";
    // import { esAdmin } from "../firebase/app_firebase.js";
    import {
        insertarPuntajes,
        esAdmin,
        auth,
        db
    }
    from "../firebase/app_firebase.js";

    import {
        ref,
        onValue
    }
    from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

    // 🔥 INICIALIZAR FIREBASE
    // const app = initializeApp(firebaseConfig);

    // const auth = getAuth(app);

    // const db = getDatabase(app);

    const mensajeJuego = document.getElementById('mensajeJuego');

    const btn_start = document.getElementById('btn_start');
    const velo1 = document.querySelector('.content-block');
    const zona = document.getElementById('zona');
    const imagen = document.getElementById('ImagenJuego');
    const contador = document.getElementById('contador');
    const btn_reset = document.getElementById("btnReset");

    // Email Admin
    export const ADMIN_EMAIL = "lukitaass2013@gmail.com";


    let juegoActivo = false;
    let intervalo;

    let tiempo=0;
    let tiempoInicial = 0;
    let tiempoRol = "";

    let encontradas = 0;
    let puntaje = 0;
    let rolUsuario ="";

    let diferencias = [
    {x:10.7, y:75.2, encontrada:false, descripcion:"Tacho sin tapa", puntos:10},
    {x:10.7, y:91.1, encontrada:false, descripcion:"RSU Desparramados", puntos:10},
    {x:10.7, y:82.2, encontrada:false, descripcion:"Tacho sin identificar con RSU mezclados", puntos:10},
    {x:14.3, y:72.4, encontrada:false, descripcion:"Tacho Rebalsado p/RSU Rebalsado", puntos:10},
    {x:14.3, y:58.4, encontrada:false, descripcion:"Cajas mal apiladas", puntos:10},
    {x:35.6, y:38.7, encontrada:false, descripcion:"Escalera quebrada y atada", puntos:10},
    {x:32.5, y:42.1, encontrada:false, descripcion:"Escalera emparchada", puntos:10},
    {x:35.6, y:59.6, encontrada:false, descripcion:"Falta pata anti deslizante", puntos:10},
    {x:32.2, y:20.8, encontrada:false, descripcion:"Escalera inadecuada apoyada en cajas", puntos:10},
    {x:42.9, y:44.2, encontrada:false, descripcion:"Falta mampara para soldadura", puntos:10},
    {x:57.7, y:42.7, encontrada:false, descripcion:"Falta cabina anti vuelco", puntos:10},
    {x:35.8, y:89.3, encontrada:false, descripcion:"Bidón sin tapa emanando gases", puntos:10},
    {x:42.8, y:88.3, encontrada:false, descripcion:"Tanque de combustible sin identificar", puntos:10},
    {x:56, y:90.6, encontrada:false, descripcion:"Derrame de aceite", puntos:10},
    {x:68.2, y:66.9, encontrada:false, descripcion:"Variación por no centrar la pieza", puntos:10},
    {x:80.7, y:65.1, encontrada:false, descripcion:"Proyecciones por alta velocidad", puntos:10},
    {x:35.1, y:46.4, encontrada:false, descripcion:"Escalón", puntos:10},
    {x:85.3, y:53.6, encontrada:false, descripcion:"Sótano abierto y sin iluminación", puntos:10},
    {x:93, y:52.6, encontrada:false, descripcion:"Escalera corta, debe salir más de un metro", puntos:10},
    {x:61.4, y:48.6, encontrada:false, descripcion:"Falta extintor", puntos:10},
    {x:39.1, y:42.7, encontrada:false, descripcion:"Soldando en charco de agua", puntos:10},
    {x:83.8, y:41.2, encontrada:false, descripcion:"Tabla con clavos para arriba", puntos:10},
    {x:88.7, y:40.9, encontrada:false, descripcion:"Tabla con clavos para arriba", puntos:10},
    {x:85.7, y:45.6, encontrada:false, descripcion:"Tabla con clavos para arriba", puntos:10},
    {x:89.7, y:57.9, encontrada:false, descripcion:"Falta de barandas al sótano", puntos:10},
    {x:87.7, y:15, encontrada:false, descripcion:"Polea sin protección", puntos:10},
    {x:86, y:5.5, encontrada:false, descripcion:"Eje sin protección", puntos:10},
    {x:66.6, y:7.7, encontrada:false, descripcion:"Barras a la vista con EE", puntos:10},
    {x:61.2, y:7.7, encontrada:false, descripcion:"Barras a la vista con EE", puntos:10},
    {x:61.2, y:18.7, encontrada:false, descripcion:"Tablero eléctrico con EE abierto sin DD", puntos:10},
    {x:70.1, y:18.7, encontrada:false, descripcion:"Falta cartel RIESGO ELÉCTRICO", puntos:10},
    {x:51.7, y:9, encontrada:false, descripcion:"Faltan carteles USO OBLIGADO EPP", puntos:10},
    {x:46.3, y:9, encontrada:false, descripcion:"Cadena del aparejo atada con hilo", puntos:10},
    {x:46.7, y:18.7, encontrada:false, descripcion:"Gancho sin seguro", puntos:10},
    {x:50.9, y:28, encontrada:false, descripcion:"Carga larga tomada de un solo punto", puntos:10}
    ];

    if(velo1){

        velo1.addEventListener('click', () => {

            if (!juegoActivo) {

                mostrarMensaje(
                `
                🎮 EL JUEGO NO HA COMENZADO
                <br><br>
                🚀 Presioná START para iniciar la evaluación
                `
                );

            }

        });

    }


    if(btn_start){
    btn_start.addEventListener('click', reloj);
    }

    if(imagen){
    imagen.addEventListener('click', cargaApp);
    }

    document.addEventListener('DOMContentLoaded',()=>{

        rolUsuario = prompt("Ingresá tu rol:").toLowerCase();

        let roles = {

          "principiante": {
            "ayudante" : 300,
            "medio oficial": 300,
            "oficial": 300
        },

          "intermedio":{
             "ejecutor":180,
             "capataz":180,
             "supervisor":180
        },

          "dificil": {
            "jefe de obra":60,
            "supervisor hys":60
        }


        };

            if(roles.principiante[rolUsuario]){

        tiempo = roles.principiante[rolUsuario];

        tiempoInicial = tiempo;

        tiempoRol = "5 minutos";

        alert(
            "Rol: " + rolUsuario +
            "\nTiempo: 5 minutos"
        );

    }

    // INTERMEDIO
    else if(roles.intermedio[rolUsuario]){

        tiempo = roles.intermedio[rolUsuario];

        tiempoInicial = tiempo;

        tiempoRol = "3 minutos";

        alert(
            "Rol: " + rolUsuario +
            "\nTiempo: 3 minutos"
        );

    }

    // DIFICIL
    else if(roles.dificil[rolUsuario]){

        tiempo = roles.dificil[rolUsuario];

        tiempoInicial = tiempo;

        tiempoRol = "1 minuto";

        alert(
            "Rol: " + rolUsuario +
            "\nTiempo: 1 minuto"
        );

    }

    else{

        alert("Rol inválido");

        tiempo = 300;

        tiempoInicial = tiempo;

        tiempoRol = "5 minutos";

    }



    });


    function cargaApp(e) {

        if (!juegoActivo) return;

        let rect = imagen.getBoundingClientRect();

        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;

        for (let i = 0; i < diferencias.length; i++) {

            let dif = diferencias[i];

            if (!dif.encontrada) {

                let distancia = Math.sqrt(
                    Math.pow(x - dif.x, 2) +
                    Math.pow(y - dif.y, 2)
                );

                if (distancia < 5) {

                    dif.encontrada = true;

                    marcar(dif.x, dif.y);

                    encontradas++;

                    // 🔥 SUMAR PUNTOS
                    puntaje += dif.puntos;

                    actualizarContador();

                    // mostrarMensaje(
                    // `
                    //     ✔ ${dif.descripcion}
                    //     <br>
                    //     ⭐ +${dif.puntos} puntos
                    // `
                    // );

                    // console.log(
                    //     "✔ " + dif.descripcion +
                    //     "\n+" + dif.puntos + " puntos"
                    // );

                    // 🔥 TERMINAR SI ENCUENTRA LAS 35
                    if (encontradas === diferencias.length) {

                        clearInterval(intervalo);

                        juegoActivo = false;

                        mostrarMensaje(
                        `
                            🏆 FELICIDADES
                                <br>
                            Encontraste las 35 diferencias
                        `
                        );
                    
                        resetearPrograma();
                    }

                    break;
                }
            }
        }
    }

    function marcar(x, y) {

        let marca = document.createElement("div");

        marca.classList.add("marca");

        marca.style.left = x + "%";
        marca.style.top = y + "%";

        zona.appendChild(marca);
    }


    function reloj() {

        if (juegoActivo) return;

        juegoActivo = true;

        if(velo1){

            velo1.classList.add('oculto');

        }

        actualizarContador();

        intervalo = setInterval(() => {

            tiempo--;

            actualizarContador();

            if (tiempo <= 0) {

                clearInterval(intervalo);

                juegoActivo = false;

                if(velo1){

                    velo1.classList.remove('oculto');

                }

                resetearPrograma();
            }

        }, 1000);

    }

    function actualizarContador(){

        let minutos = Math.floor(tiempo / 60);

        let segundos = tiempo % 60;

        segundos = segundos < 10 ? "0" + segundos : segundos;

        contador.innerHTML =
        `
        ⏰ ${minutos}:${segundos}
        `;
        mostrarPntaje();
    }

    function mostrarPntaje(){
    let contentPuntos = document.querySelector('.content-puntos');
    contentPuntos.innerHTML = `
    ⭐ ${puntaje} puntos
        <br>
        ✅ ${encontradas}/${diferencias.length}
    `;   
    }

    function resetearPrograma() {

        let nombre = prompt("Ingresá tu nombre:");

        if (!nombre || nombre.trim() === "") {
            nombre = "Jugador";
        }

            // CALCULAR TIEMPO USADO
        // TIEMPO GASTADO
            let tiempoGastado = tiempoInicial - tiempo;

            let minutos = Math.floor(tiempoGastado / 60);

            let segundos = tiempoGastado % 60;

            segundos = segundos < 10 ? "0" + segundos : segundos;

            let tiempoUsado = `${minutos}:${segundos}`;
        // 🔥 GUARDAR EN FIREBASE
        insertarPuntajes(nombre, puntaje, tiempoUsado, tiempoRol, rolUsuario);

        mostrarMensaje(
            `
            🎮 ${nombre}
                <br>
            ⭐ Puntaje: ${puntaje}
                <br>
            ✅ Diferencias: ${encontradas}
            
            `
            );

        document.querySelectorAll('.marca').forEach(m => m.remove());

        encontradas = 0;

        puntaje = 0;

        diferencias.forEach(d => d.encontrada = false);

        contador.innerHTML = "0";
    }

    export function mostrarMensaje(texto){

        mensajeJuego.innerHTML = texto;

        mensajeJuego.classList.add('activo');

        setTimeout(()=>{

            mensajeJuego.classList.remove('activo');

        },2500);
    }

    // SE REPITE ACA 
    // function eliminarTabla(){
    //     auth.onAuthStateChanged(async(user)=>{

    //     if(!user) return;

    //     const admin;
    //     await esAdmin(user.uid);

    //     // mostrar boton solo admin
    //     if(admin){

    //         btnReset.style.display = "block";

    //     }else{

    //         btnReset.style.display = "none";
    //     }

    //     const jugadoresRef =
    //     ref(db,"Jugadores");

    //     onValue(jugadoresRef,(snapshot)=>{

    //         tabla.innerHTML = "";

    //         const datos = snapshot.val();

    //         for(let id in datos){

    //             const jugador = datos[id];

    //             // ADMIN VE TODO
    //             if(admin){

    //                 tabla.innerHTML += `

    //                     <div class="card-puntos">

    //                         <h2>${jugador.nombre}</h2>

    //                         <p>${jugador.puntos} puntos</p>

    //                     </div>
    //                 `;
    //             }

    //             // USUARIO SOLO SUS DATOS
    //             else if(jugador.uid === user.uid){

    //                 tabla.innerHTML += `

    //                     <div class="card-puntos">

    //                         <h2>${jugador.nombre}</h2>

    //                         <p>${jugador.puntos} puntos</p>

    //                     </div>
    //                 `;
    //             }
    //         }
    //     });
    // });

    // }

