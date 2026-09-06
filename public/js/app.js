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
    //Condiciones subestandar 
    { nombre: "Tacho sin tapa", x:10.7, y:75.2, encontrada:false, puntos:10},
    { nombre: "RSU Desparramados", x:10.7, y:91.1, encontrada:false, puntos:10},
    { nombre: "Tacho sin identificar con RSU mezclados", x:10.7, y:82.2, encontrada:false, puntos:10},
    { nombre: "Tacho Rebalsado p/RSU Rebalsado", x:14.3, y:72.4, encontrada:false, puntos:10},
    { nombre: "Cajas mal apiladas", x:14.3, y:58.4, encontrada:false, puntos:10},
    { nombre: "Escalera quebrada y atada", x:35.6, y:38.7, encontrada:false,  puntos:10},
    { nombre: "Escalera emparchada", x:32.5, y:42.1, encontrada:false,  puntos:10},
    { nombre: "Falta pata anti deslizante", x:35.6, y:59.6, encontrada:false, puntos:10},
    { nombre: "no uso de guantes agarrado a madera", x:32.2, y:20.8, encontrada:false, puntos:10},
    { nombre: "Falta mampara para soldadura", x:42.9, y:44.2, encontrada:false,  puntos:10},
    { nombre: "Falta cabina anti vuelco", x:57.7, y:42.7, encontrada:false, puntos:10},
    { nombre: "Bidón sin tapa emanando gases", x:35.8, y:89.3, encontrada:false,  puntos:10},
    { nombre: "Tanque de combustible sin identificar", x:42.8, y:88.3, encontrada:false, puntos:10},
    { nombre: "Derrame de aceite", x:56, y:90.6, encontrada:false, puntos:10},
    { nombre: "Variación por no centrar la pieza", x:68.2, y:66.9, encontrada:false, puntos:10},
    { nombre: "Proyecciones por alta velocidad", x:80.7, y:65.1, encontrada:false, puntos:10},
    { nombre: "Escalón roto", x:35.1, y:46.4, encontrada:false, puntos:10},
    { nombre: "Sótano abierto y sin iluminación", x:85.3, y:53.6, encontrada:false, puntos:10},
    { nombre: "Escalera corta, debe salir más de un metro", x:93, y:52.6, encontrada:false,  puntos:10},
    { nombre: "Falta extintor", x:61.4, y:48.6, encontrada:false, puntos:10},
    { nombre: "Soldando en charco de agua", x:39.1, y:42.7, encontrada:false, puntos:10},
    { nombre: "Tabla con clavos para arriba", x:83.8, y:41.2, encontrada:false, puntos:10},
    { nombre: "Tabla con clavos para arriba" ,x:88.7, y:40.9, encontrada:false,  puntos:10},
    { nombre: "Tabla con clavos para arriba", x:85.7, y:45.6, encontrada:false, puntos:10},
    { nombre: "Falta de barandas al sótano", x:89.7, y:57.9, encontrada:false, puntos:10},
    { nombre: "Polea sin protección", x:87.7, y:15, encontrada:false, puntos:10},
    { nombre: "Eje sin protección", x:86, y:5.5, encontrada:false, puntos:10},
    { nombre: "Barras a la vista con EE", x:66.6, y:7.7, encontrada:false, puntos:10},
    { nombre: "Barras a la vista con EE", x:61.2, y:7.7, encontrada:false,  puntos:10},
    { nombre: "Tablero eléctrico con EE abierto sin DD",x:61.2, y:18.7, encontrada:false, puntos:10},
    { nombre: "Falta cartel RIESGO ELÉCTRICO", x:70.1, y:18.7, encontrada:false, puntos:10},
    { nombre: "Faltan carteles USO OBLIGADO EPP", x:51.7, y:9, encontrada:false, puntos:10},
    { nombre: "Cadena del aparejo atada con hilo", x:46.3, y:9, encontrada:false, puntos:10},
    { nombre: "Gancho sin seguro", x:46.7, y:18.7, encontrada:false, puntos:10},
    { nombre: "Carga larga tomada de un solo punto", x:50.9, y:28, encontrada:false, puntos:10},
    // Actos subestandar
    { nombre: "Tornero sin protección ocular", x:75.5, y:58.9, encontrada:false, puntos:10},
    { nombre: "Tornero sin sordina", x:77.5, y:58.9, encontrada:false, puntos:10},
    { nombre: "Soldando sin máscara", x:63.2, y:29.7, encontrada:false, puntos:10},
    { nombre: "Soldando arrodillado sin rodilleras", x:71.5, y:36.1, encontrada:false, puntos:10},
    { nombre: "Electricista sin protección ocular", x:57.2, y:10.7, encontrada:false, puntos:10},
    { nombre: "Soldando sin mascara de soldador", x:42.6, y:35.9, encontrada:false, puntos:10},
    { nombre: "Soldando arrodillado sin rodilleras", x:46.1, y:46.7, encontrada:false, puntos:10},    
    { nombre: "Moviendo caja con polvo sin lentes", x:47.1, y:50.7, encontrada:false, puntos:10},        
    { nombre: "levantando con fuerza de espalda", x:53.1, y:56.7, encontrada:false, puntos:10},    
    { nombre: "fumando cerca de combustibles", x:30.8, y:63.3, encontrada:false, puntos:10},  
    { nombre: "no uso de lentes de seguridad", x:76.2, y:18.7, encontrada:false, puntos:10},
    { nombre: "Escalera emparchada", x:32.5, y:37.1, encontrada:false, puntos:10},
    { nombre: "Escalera emparchada", x:29.5, y:24.1, encontrada:false, puntos:10},
    { nombre: "no uso de lentes de seguridad", x:30.8, y:60.3, encontrada:false, puntos:10},
    { nombre: "En movil sin cinturon de seguridad", x:60.7, y:40.7, encontrada:false, puntos:10},
    { nombre: "Tablero eléctrico con EE abierto sin DD", x:56.2, y:25.7, encontrada:false, puntos:10},
    { nombre: "Soldando sin guantes", x:42.9, y:44.2, encontrada:false, puntos:10},    
    { nombre: "colocaron muchas piezas y no se ve", x:82.1, y:18.7, encontrada:false, puntos:10},    
    { nombre: "autoelevador muy rapido", x:55.1, y:46.6, encontrada:false, puntos:10},
    { nombre: "personal sin botines de seguridad", x:79, y:88.6, encontrada:false, puntos:10},
    { nombre: "personal sin botines de seguridad", x:27, y:90.3, encontrada:false,  puntos:10},
    { nombre: "personal sin botines de seguridad", x:51.1, y:70.7, encontrada:false, puntos:10},
    { nombre: "personal sin botines de seguridad", x:82.1, y:35.7, encontrada:false, puntos:10},
    { nombre: "calzado no antideslizante", x:36.2, y:32.8, encontrada:false, puntos:10},    
    { nombre: "calzado no antideslizante", x:26, y:20.8, encontrada:false, puntos:10},
    { nombre: "calzado no antideslizante", x:30.8, y:57.3, encontrada:false, puntos:10},
    { nombre: "levantando con fuerza de espalda", x:46.1, y:50.7, encontrada:false,  puntos:10},        
    { nombre: "levantando con fuerza de espalda", x:63.2, y:27.7, encontrada:false, puntos:10},        
    
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

    // esto te da las coordenaas exactas
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

    // esto te marca los puntos marcados
    function marcar(x, y) {

        let marca = document.createElement("div");

        marca.classList.add("marca");

        marca.style.left = x + "%";
        marca.style.top = y + "%";

        zona.appendChild(marca);
    }

    // Esto muestra el reloj
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
            nombre = null;

            mostrarMensaje(`
            ⚠️ No se guardaron los puntos
            <br>
            Debés ingresar un nombre        
            `);

        }else{
            nombre = nombre.trim();
            
            // CALCULAR TIEMPO USADO
        // TIEMPO GASTADO
            let tiempoGastado = tiempoInicial - tiempo;

            let minutos = Math.floor(tiempoGastado / 60);

            let segundos = tiempoGastado % 60;

            segundos = segundos < 10 ? "0" + segundos : segundos;

            let tiempoUsado = `${minutos}:${segundos}`;
            // NEW FUNCTION 

            const resultadoFinal = diferencias.map(d => ({
                nombre: d.nombre,
                encontrada: d.encontrada
            }));

               // 🔥 GUARDAR EN FIREBASE
            insertarPuntajes(nombre, puntaje, tiempoUsado, tiempoRol, rolUsuario, resultadoFinal);

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

    }

    export function mostrarMensaje(texto){

        mensajeJuego.innerHTML = texto;

        mensajeJuego.classList.add('activo');

        setTimeout(()=>{

            mensajeJuego.classList.remove('activo');

        },2500);
    }

   