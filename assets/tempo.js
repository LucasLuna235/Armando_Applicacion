    const btn_start = document.getElementById('btn_start');
    const velo1 = document.querySelector('.content-block');
    const zona = document.getElementById('zona');
    const imagen = document.getElementById('ImagenJuego');
    const marcas = document.querySelector('.marca');
    const game = document.querySelector(".game");


    let juegoActivo = false;
    let tiempo;
    let intervalo;

    let diferencias = [
        {x:60, y:430,encontrada : false},//RSU desparramados
        {x:60, y:390,encontrada : false},//Tacho sin identificar
        {x:60, y:352,encontrada : false},//Tacho sin tapa
        {x:80, y:310,encontrada : false},//Tacho revalsado
        {x:80, y:250,encontrada : false},//Cajas mal apiladas
        {x:210, y:200,encontrada : false},//Escalera emparchada
        {x:189, y:210,encontrada : false},//Escalera quebrada y atada
        {x:199, y:255,encontrada : false},
        {x:180, y:89,encontrada : false},
        {x:240, y:189,encontrada : false},
        {x:300, y:200,encontrada : false},
        {x:200, y:395,encontrada : false},//Bidón sin tapa
        {x:256, y:395,encontrada : false},//Tanque de combustible sin identificar
        {x:330, y:405,encontrada : false},//Derrame de aceite
        {x:415, y:295,encontrada : false},//Proyecciones por alta velocidad
        {x:490, y:300,encontrada : false},//Variaciones por no colocar bien la pieza
        {x:520, y:250,encontrada : false},//Zotano abierto y sin iluminación
        {x:555, y:255,encontrada : false},//Escalera debe salir 1 metro
        {x:563, y:225,encontrada : false},//falta barandas en el zotano
        {x:343, y:225,encontrada : false},
        {x:353, y:200,encontrada : false},
        {x:500, y:180,encontrada : false},
        {x:535, y:175,encontrada : false},
        {x:535, y:195,encontrada : false},
        {x:535, y:175,encontrada : false},
        {x:535, y:60,encontrada : false},
        {x:520, y:15,encontrada : false},
        {x:400, y:20,encontrada : false},
        {x:370, y:20,encontrada : false},
        {x:370, y:80,encontrada : false},
        {x:420, y:80,encontrada : false},
        {x:310, y:30,encontrada : false},
        {x:278, y:30,encontrada : false},
        {x:278, y:80,encontrada : false},
        {x:290, y:120,encontrada : false} 
    ];

    let encontradas = 0;



    velo1.addEventListener('click',()=>{
        alert('Debes hacer click en Start para empezar!!');
    });

    btn_start.addEventListener('click', reloj);

    imagen.addEventListener('click',cargaApp);


    function cargaApp(e){
        
        let rect = imagen.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        diferencias.forEach((dif)=>{

            if(!dif.encontrada){
                
                let distancia = Math.sqrt(
                    Math.pow(x - dif.x,2) +
                    Math.pow(y - dif.y,2)
                );

                if(distancia < 40){

                    dif.encontrada = true;

                    marcar(dif.x,dif.y);

                    encontradas++;

                    contador.textContent = encontradas;
                    console.log('Guardado: ',dif);
                    

                    if(encontradas == 35){
                        alert("🎉 ¡Encontraste los 35 puntos!");
                    }

                }

            }

        });

    }

    function marcar(x,y){

        let marca = document.createElement("div");

        marca.classList.add("marca");

        marca.style.left = (x-15) + "px";
        marca.style.top = (y-15) + "px";

        game.appendChild(marca);

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

        },500);

    }

 // Arreglar la function Insertar Puntajes
 
   function insertarPuntajes(nombre,encontradas){
     let tiempo = "5:00";
     html2canvas(game, {
     useCORS: true
    }).then(canvas => {

     let imagen = canvas.toDataURL('image/png');

     let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

     jugadores.push({
        id: Date.now(),
        nombre: nombre,
        puntos: encontradas,
        tiempo: tiempo,
        imagen: imagen    
     });

     jugadores.sort((a,b)=>b.puntos - a.puntos);

     localStorage.setItem('jugadores', JSON.stringify(jugadores));

     console.log('Jugador Guardado 🔥');
     });   
    }   

 

function resetearPrograma(){

    let nombre = prompt("Ingresá tu nombre: ");

    if(encontradas < 35){
        insertarPuntajes(nombre,encontradas); 
        alert("Tiempo terminado 😈, "+nombre+" encontraste: "+encontradas+" puntos");
        marcas.forEach(m => m.remove());
        encontradas = 0;
        diferencias.forEach(d => d.encontrada=false); 
    }
}

