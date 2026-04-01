document.addEventListener("DOMContentLoaded", mostrarRanking);
document.getElementById("btnReset").addEventListener('click',resetRanking);


const tbody = document.getElementById("ranking");

function mostrarRanking(){

    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

    

    // 🏆 ordenar por puntos
    jugadores.sort((a,b) => b.puntos - a.puntos);

    jugadores.forEach((j, i) => {

        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${j.nombre}</td>
            <td>${j.puntos}</td>
            <td>${j.tiempo || "05:00"}</td>
            <td>
             <img src="${j.imagen}" width="100" style="border-radius:10px; cursor:pointer" class="img-preview">
            </td>
        `;

        let img = tr.querySelector('.img-preview');
        img.addEventListener('click',()=>{
            localStorage.setItem('imagenSeleccionada',j.imagen);
            window.location.href = 'img.html';
        })

        tbody.appendChild(tr);
    });
    
}

function resetRanking(){
    localStorage.removeItem("jugadores");
    tbody.innerHTML="";
    alert("La tabla fue limpiada, correctamente!");
}