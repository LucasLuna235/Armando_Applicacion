document.getElementById('btn_start').addEventListener('click',reloj);
const action = document.querySelector('.content-action');
const velo1 = document.querySelector('.content-block'); 
const casilleros_correctos = ['C2','D3','E2','E3','F2','I5','C5','E5','H5','C6','F6'];

let correctas = 0;
let incorrectas = 0;

document.addEventListener('DOMContentLoaded',()=>{
    velo1.addEventListener('click',()=>{
        alert("Debes tocar START para iniciar");
    })    
    crearTablero();
});

function crearTablero(){
    action.innerHTML="";
    const letras = "ABCDEFGHIJ";
    for(let fila = 1; fila<=10; fila++){
     for(let col = 0; col < letras.length; col++){

        const casilla = document.createElement("div");
        casilla.classList.add("piso");
        // aca se agregan las letras
        const nombre = letras[col] + fila;
        casilla.id = nombre;
        
        casilla.textContent = nombre;

       casilla.addEventListener('click',e =>{
            if(casilla.textContent === "✔" || casilla.textContent === "✖") return;
          if(e.target.classList.contains('piso')){
              console.log('Casilla: ', e.target.id);

             // evitar que se pueda volver a clickear
                // if (casilla.textContent !== "") return;

              if(casilleros_correctos.includes(nombre)){
                casilla.textContent = "✔";
                casilla.classList.add('correcto');
            
                correctas ++;
              }else{
                casilla.textContent = "✖";
                casilla.classList.add('incorrecto');
                
                incorrectas ++;
             }

        }
    });


        action.appendChild(casilla);
     }
    }
}


function reloj(){
    velo1.classList.add('oculto');
    tiempo = 300;
    
    crearTablero();

    intervalo = setInterval(()=>{
        let minutos = Math.floor(tiempo / 60);
        let segundos = tiempo % 60;

        segundos = segundos < 10 ? "0" + segundos : segundos;
        minutos = minutos < 10 ? "0" + minutos : minutos;

        let contador = document.getElementById('contador');
        contador.innerHTML = minutos+' : '+segundos;

        tiempo--;

        if(tiempo<0){
            clearInterval(intervalo);
            contador.innerHTML = "00:00";
            velo1.classList.remove('oculto');
            resetearPrograma();
        }

    },500);
}

function resetearPrograma(){
    alert(
        "Tiempo terminado 😈\n"+
        "✔ Correctas: "+ correctas + "\n"+
        "✖ Incorrectas: "+ incorrectas
    );
    crearTablero();
}