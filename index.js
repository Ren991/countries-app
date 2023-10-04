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
        console.log(data);

        // Llama a otra función y pásale el array de datos de países
        processData(data);
    } catch (error) {
        console.error(error);
    }
}

function processData(countriesData) {
    // Ahora puedes trabajar con el array de datos de países aquí
    console.log('Número de países:', countriesData.length);

    var datosPaises = [];
    // Ejemplo: Imprime los nombres de los países
    countriesData.forEach(country => {
        console.log(country.name.common);
        datosPaises.push({
            nombre: country.name.common,
            bandera: country.flags.svg,
            continente: country.region,
            mapa: country.maps.googleMaps,


            poblacion: country.population
        })
    });
    console.log(datosPaises);

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
        <img src="${pais.bandera}" alt="${pais.nombre}" class="bandera" height="50">
        <h2 class="nombre">${pais.nombre}</h2>
        <p><strong>Capital:</strong> </p>
        <p><strong>Región:</strong> ${pais.continente}</p>
        <p><strong>Población:</strong> ${pais.poblacion.toLocaleString()}</p>
      </div>
    `;
        tarjetaHTML = (function (pais) {
            var tarjeta = document.createElement('div');
            tarjeta.innerHTML = tarjetaHTML;
            tarjeta.querySelector('.tarjeta').addEventListener("click", function () {
                // Muestra la tarjeta de detalle con la información del país seleccionado
                var detalleHTML = `
            <div class="detalle-tarjeta-contenido">
            
              <button class="botoncerrar" onclick="cerrarDetalle()">Cerrar</button>              
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



fetchData();

