const btn_start = document.getElementById('btn_start');
const velo1 = document.querySelector('.content-block');
const zona = document.getElementById('zona');
const imagen = document.getElementById('ImagenJuego');
const game = document.querySelector(".game");
const contador = document.getElementById('contador');

let juegoActivo = false;
let tiempo;
let intervalo;

let diferencias = [
{x:10.7, y:100, encontrada:false},
{x:10.7, y:91.1, encontrada:false},
{x:10.7, y:82.2, encontrada:false},
{x:14.3, y:72.4, encontrada:false},
{x:14.3, y:58.4, encontrada:false},
{x:37.6, y:46.7, encontrada:false},
{x:33.8, y:49.1, encontrada:false},
{x:35.6, y:59.6, encontrada:false},
{x:32.2, y:20.8, encontrada:false},
{x:42.9, y:44.2, encontrada:false},
{x:53.7, y:46.7, encontrada:false},
{x:35.8, y:89.3, encontrada:false},
{x:42.8, y:88.3, encontrada:false},//Ya esta
{x:56, y:90.6, encontrada:false},//Ya esta
{x:74.2, y:68.9, encontrada:false},
{x:87.7, y:70.1, encontrada:false},
{x:93, y:58.4, encontrada:false},
{x:99.3, y:59.6, encontrada:false},
{x:100, y:52.6, encontrada:false},
{x:61.4, y:52.6, encontrada:false},
{x:63.1, y:46.7, encontrada:false},
{x:89.4, y:42.1, encontrada:false},
{x:95.7, y:40.9, encontrada:false},
{x:95.7, y:45.6, encontrada:false},
{x:95.7, y:40.9, encontrada:false},
{x:95.7, y:14, encontrada:false},
{x:93, y:3.5, encontrada:false},
{x:71.6, y:4.7, encontrada:false},
{x:66.2, y:4.7, encontrada:false},
{x:66.2, y:18.7, encontrada:false},
{x:75.1, y:18.7, encontrada:false},
{x:55.5, y:7, encontrada:false},
{x:49.7, y:7, encontrada:false},
{x:49.7, y:18.7, encontrada:false},
{x:51.9, y:28, encontrada:false}
];

let encontradas = 0;

velo1.addEventListener('click',()=>{
    if(!juegoActivo){
        alert('Debes hacer click en Start para empezar!!');
    }
});

btn_start.addEventListener('click', reloj);
imagen.addEventListener('click', cargaApp);

function cargaApp(e){

    if(!juegoActivo) return;

    let rect = imagen.getBoundingClientRect();

    let x = ((e.clientX - rect.left)/ rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    for (let i = 0; i < diferencias.length; i++) {

        let dif = diferencias[i];

        if (!dif.encontrada) {

            let distancia = Math.sqrt(
                Math.pow(x - dif.x, 2) +
                Math.pow(y - dif.y, 2)
            );

            if (distancia < 5) { // 🔥 AJUSTADO A %

                dif.encontrada = true;

                marcar(dif.x, dif.y);

                encontradas++;
                contador.textContent = encontradas;

                break;
            }
        }
    }
}

function marcar(x,y){

    let marca = document.createElement("div");
    marca.classList.add("marca");

    marca.style.left = x + "%";
    marca.style.top = y + "%";

    zona.appendChild(marca); // 🔥 FIX CLAVE

}

function reloj(){

    juegoActivo = true;

    velo1.classList.add('oculto');

    tiempo = 300;

    intervalo = setInterval(()=>{

        let minutos = Math.floor(tiempo / 60);
        let segundos = tiempo % 60;

        segundos = segundos < 10 ? "0" + segundos : segundos;
        minutos = minutos < 10 ? "0" + minutos : minutos;

        contador.innerHTML = minutos+' : '+segundos;

        tiempo--;

        if(tiempo < 0){

            clearInterval(intervalo);

            contador.innerHTML = "00:00";

            juegoActivo = false;

            velo1.classList.remove('oculto');

            resetearPrograma();

        }

    },1000); // 🔥 FIX TIEMPO
}

function insertarPuntajes(nombre,encontradas){

    let tiempoFinal = "5:00";

    html2canvas(game, { useCORS: true }).then(canvas => {

        let imagen = canvas.toDataURL('image/png');

        let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        jugadores.push({
            id: Date.now(),
            nombre,
            puntos: encontradas,
            tiempo: tiempoFinal,
            imagen    
        });

        jugadores.sort((a,b)=>b.puntos - a.puntos);

        localStorage.setItem('jugadores', JSON.stringify(jugadores));

    });   
}

function resetearPrograma(){

    let nombre = prompt("Ingresá tu nombre: ");

    insertarPuntajes(nombre,encontradas);

    alert("Resultado: "+encontradas+" puntos");

    // 🔥 BORRAR BIEN
    document.querySelectorAll('.marca').forEach(m => m.remove());

    encontradas = 0;

    diferencias.forEach(d => d.encontrada=false);
}

console.log(imagen.naturalWidth, imagen.naturalHeight);