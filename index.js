// Declara una variable global para almacenar los datos de los países
var datosPaises = [];
var continenteFiltrado = [];
var paisesFiltrados = [];


function cerrarDetalle() {
    var detalleTarjeta = document.getElementById("detallePais");
    detalleTarjeta.style.display = "none"; // Oculta la tarjeta de detalle
}

async function fetchData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();


        // Llama a otra función y pásale el array de datos de países
        processData(data);
    } catch (error) {
        console.error(error);
    }
}

function processData(countriesData) {

    datosPaises = [];



    countriesData.forEach(country => {



        datosPaises.push({
            nombre: country.name.common,
            bandera: country.flags.svg,
            continente: country.region,
            mapa: country.maps.googleMaps,
            poblacion: country.population,
            idioma: country.languages !== undefined ? Object.values(country.languages)[0] : "-",
            coordenadas: country.latlng,
            capital: country.capital,
            independiente: country.independent === true ? "Si" : "No",
            zonahoraria: country.timezones[0],
        })
    });


    muestraTarjetas(datosPaises);
}

function muestraTarjetas(datosPaises) {
    var contenedorTarjetas = document.getElementById("contenedorTarjetas");
    var detalleTarjeta = document.getElementById("detallePais");

    // Limpia el contenido previo del contenedor
    contenedorTarjetas.innerHTML = "";

    // Recorre los datos de los países y crea una tarjeta para cada uno
    for (var i = 0; i < datosPaises.length; i++) {
        var pais = datosPaises[i];
        var tarjetaHTML = `
      <div class="tarjeta">
        <img src="${pais.bandera}" alt="${pais.nombre}"  height="40" width="200">
        <h1 class="nombre">${pais.nombre}</h1>
        <h6>${pais.continente}</h6>
        
        
      </div> 
    `;
        tarjetaHTML = (function (pais) {

            var tarjeta = document.createElement('div');
            tarjeta.innerHTML = tarjetaHTML;
            tarjeta.querySelector('.tarjeta').addEventListener("click", function () {
                // Muestra la tarjeta de detalle con la información del país seleccionado
                var detalleHTML = `
            



            <div class="card">
            <div class="header">
              <div>
                <a class="title" href="#">
                <h1 class="nombre">${pais.nombre}</h1>
                </a>
                <p class="name">Continente: ${pais.continente}</p>
              </div>
                
                <img src="${pais.bandera}" alt="${pais.nombre}" class="bandera" >
                
            </div>
              
            <div>
                <h5>Poblacion: ${pais.poblacion}</h5>
                <h5>Idioma: ${pais.idioma}</h5>
                <h5>Coordenadas: ${pais.coordenadas}</h5>
                <h5>Capital: ${pais.capital}</h5>
                <h5>País independiente: ${pais.independiente}</h5>
                <h5>Zona horaria: ${pais.zonahoraria}</h5>
            </div>

            <button class="botonCerrar" onclick="cerrarDetalle()">Cerrar</button> 
          </div>   


          `;
                detalleTarjeta.innerHTML = detalleHTML;
                detalleTarjeta.style.display = "block"; // Muestra la tarjeta de detalle
            });
            return tarjeta;
        })(pais);

        // Agrega la tarjeta al contenedor
        contenedorTarjetas.appendChild(tarjetaHTML);
    }
}

function filtrarContinente() {
    var opcionSeleccionada = document.getElementById("select-continentes").value;


    if (opcionSeleccionada !== "0") {
        continenteFiltrado = datosPaises.filter(pais => pais.continente === opcionSeleccionada);
        muestraTarjetas(continenteFiltrado)

    } else {
        muestraTarjetas(datosPaises)
    }

}

function filtrarPaises() {
    var ingresoUser = document.getElementById("filtroPais").value;


    if (continenteFiltrado.length !== 0) {
        paisesFiltrados = continenteFiltrado.filter(pais => pais.nombre.toLowerCase().includes(ingresoUser));
    } else {
        paisesFiltrados = datosPaises.filter(pais => pais.nombre.toLowerCase().includes(ingresoUser));
    }

    if (paisesFiltrados.length === 0) {

        Swal.fire({

            icon: 'error',
            title: 'No se encontraron resultados',
            showConfirmButton: true,

        })
        muestraTarjetas(datosPaises)
        document.getElementById("filtroPais").value = "";

    } else {
        // Muestra las tarjetas de los países filtrados
        muestraTarjetas(paisesFiltrados);
    }



}

fetchData();


