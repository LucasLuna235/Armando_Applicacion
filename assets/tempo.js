document.getElementById('btn_start').addEventListener('click', reloj);

const velo1 = document.querySelector('.content-block');
const zona = document.getElementById('zona');

let juegoActivo = false;
let tiempo;
let intervalo;

// CLICK EN LA IMAGEN
zona.addEventListener("click", function(e){

    if(!juegoActivo){
        alert("Debes tocar START para iniciar");
        return;
    }

    const rect = zona.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const marca = document.createElement("div");
    marca.classList.add("marca");

     marca.textContent = "⭕";

    marca.style.left = x + "px";
    marca.style.top = y + "px";

    zona.appendChild(marca);

});

function reloj(){

    juegoActivo = true;

    velo1.classList.add('oculto');

    tiempo = 300;

    intervalo = setInterval(()=>{

        let minutos = Math.floor(tiempo / 60);
        let segundos = tiempo % 60;

        segundos = segundos < 10 ? "0" + segundos : segundos;
        minutos = minutos < 10 ? "0" + minutos : minutos;

        let contador = document.getElementById('contador');

        contador.innerHTML = minutos+' : '+segundos;

        tiempo--;

        if(tiempo < 0){

            clearInterval(intervalo);

            contador.innerHTML = "00:00";

            juegoActivo = false;

            velo1.classList.remove('oculto');

            resetearPrograma();

        }

    },200);

}

function resetearPrograma(){

    alert(
        "Tiempo terminado 😈\n"+
        "✔ Correctas: "+ correctas + "\n"+
        "✖ Incorrectas: "+ incorrectas
    );

    correctas = 0;
    incorrectas = 0;

}