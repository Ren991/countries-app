// SE DECLARAN 3 VARIABLES GLOBALES.
// DATOS PAISES ES EL ARRAY QUE TIENE LA RESPUESTA DE LA API
// CONTINENTE FILTRADO ES EL ARRAY QUE TIENE LOS PAISES DEL CONTINENTE FILTRADO POR EL USUARIO
// PAISES FILTRADOS ES EL ARRAY QUE TIENE LOS PAISES FILTRADOS POR EL USUARIO
var datosPaises = [];
var continenteFiltrado = [];
var paisesFiltrados = [];


function cerrarDetalle() {
    //ESTA FUNCION CIERRA EL DETALLE DEL PAIS
    var detalleTarjeta = document.getElementById("detallePais");
    detalleTarjeta.style.display = "none"; // Oculta la tarjeta de detalle
}

async function fetchData() {
    // FUNCION ASÍNCRONA PARA FETCHEAR LA API 
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
    // ESTA FUNCION PROCESA LOS DATOS TRAÍDOS DE LA API
    // LOS ALMACENA EN DATOS PAISES.

    datosPaises = [];

    countriesData.forEach(country => {       

        datosPaises.push({
            nombre: country.translations.spa.common,
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
    // ESTA FUNCION SE ENCARGA DEL RENDERIZADO DE TARJETAS EN LA VISTA
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
    // ESTA FUNCION FILTRA EL CONTINENTE MEDIANTE EL SELECT.
    // VUELVE A LLAMAR LA FUNCION QUE MUESTRA LAS TARJETAS PASANDOLE 
    // COMO PARÁMETRO LOS PAISES FILTRADOS POR EL CONTINENTE ELEGIDO
    var opcionSeleccionada = document.getElementById("select-continentes").value;

    if (opcionSeleccionada !== "0") {
        continenteFiltrado = datosPaises.filter(pais => pais.continente === opcionSeleccionada);
        muestraTarjetas(continenteFiltrado)

    } else {
        muestraTarjetas(datosPaises)
    }
}

function filtrarPaises() {
    // ESTA FUNCION FILTRA PAISES INGRESADOR POR EL USUARIO
    var ingresoUser = document.getElementById("filtroPais").value.toLowerCase();

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

/*JUEGO CAPITALES*/
//SE INICIALIZAN VARIABLES GLOBALES PARA DEFINIR
// INDICES, RESPUESTAS CORRECTAS/ INCORRECTAS.
var indiceAleatorioCapital;
var indicePreguntaActualCapital = 0;
var puntajeCapital = 0;
var paisAleatorioCapital;
var capitalAleatorioCapital;
var respuestaCorrectasCapital = 0;
var respuestaIncorrectasCapital = 0;
var audio = document.getElementById("miAudio");

function juegoCapitales() {
    //ESTA FUNCION GUARDA EN VARIABLES OBJETOS DEL DOM.
    //SI EL INDICE DE PREGUNTA ACTUAL ES 5 MUESTRA MENSAJE FINALIZADO
    // SINO LLAMA LA FUNCIÓN QUE MUESTRA PREGUNTA.

    var contenedorTarjetas = document.getElementById("contenedorTarjetas");
    var detallePais = document.getElementById("detallePais");
    var contJuegCap = document.getElementById("juegoCapitales");
    var contJuegBan = document.getElementById("juegoBanderas");    

    contenedorTarjetas.style.display = "none";
    detallePais.style.display = "none";
    contJuegCap.style.display = "block";
    contJuegBan.style.display ="none";    

    indiceAleatorioCapital = Math.floor(Math.random() * 250);

    if (indicePreguntaActualCapital >= 5) {
        Swal.fire({

            icon: 'success',
            title: 'Juego terminado',
            text: `Respuestas correctas: ${respuestaCorrectasCapital}; 
            Respuestas incorrectas : ${respuestaIncorrectasCapital}`,
            showConfirmButton: true,

        })
        
        audio.play();
        
        contenedorTarjetas.style.display = "flex";
        contJuegCap.style.display = "none";

        //Se vuelven a inicializar en cero el puntaje y el índice
        indicePreguntaActualCapital = 0;
        puntajeCapital = 0;
        respuestaCorrectasCapital = 0;
        respuestaIncorrectasCapital = 0;
        
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } else {
        mostrarPregunta(indiceAleatorioCapital, indicePreguntaActualCapital);        
    }
}

function mostrarPregunta(indiceAleatorioCapital, indicePreguntaActualCapital) {
    
    // ESTA FUNCION TIENE 2 PARÁMETROS , EL INDICEALEATORIO CAPITAL SE USA PARA FILTRAR
    // EL PAIS ALEATORIO, Y EL INDICE PREGUNTA ACTUAL ES PARA SABER EN QUE PREGUNTA DE LAS 5
    // ESTÁ EL USER.
    // TENIENDO EN CUENTA EL PAIS ALEATORIO SE FORMULA LA PREGUNTA

    var pregunta = document.getElementById("juegoCapitales")

    paisAleatorio = datosPaises[indiceAleatorioCapital];
    capitalAleatorio = paisAleatorio.capital[0];    

    pregunta.innerHTML = `
    <div id="contenedorJuegoBandera" class="card" style="width: 24rem;">
    <img class="card-img-top" src=${paisAleatorio.bandera} alt="Card image cap">
    <div class="card-body">
        <h5 class="card-title">Cual es la capital de  ${paisAleatorio.nombre}?</h5>
        <input type="text" id="respuesta" placeholder="Escribe tu respuesta">
        <button id="enviarRespuesta" onclick="verificarRespuesta()">Enviar respuesta</button>
       
        </div>
    </div>   
    
    `
}

function verificarRespuesta() {
    // ESTA FUNCION VERIFICA LA RESPUESTA INGRESADA POR EL USUARIO
    // SI LA RESPUESTA ES CORRECTA SUMA 1 EN EL CONTADOR DE LAS CORRECTAS
    // POR EL CONTRARIO SUMA 1 EN EL CONTRADOR DE LAS INCORRECTAS.
    // SI EL USUARIO NO INGRESA NADA MUESTRA MENSAJE DE ERROR.

    var respuestaCorrecta = capitalAleatorio;
    var respuestaUsuario = document.getElementById("respuesta").value;

    if (respuestaUsuario === "" || respuestaUsuario === undefined) {
        
        Swal.fire({

            icon: 'error',
            title: 'El campo no puede estar vacío ',
            showConfirmButton: true,

        })
    } else {
        if (respuestaUsuario.toLowerCase() !== respuestaCorrecta.toLowerCase()) {
            
            respuestaIncorrectasCapital += 1;
        } else {
            
            respuestaCorrectasCapital += 1;
        }
        indicePreguntaActualCapital += 1;
        document.getElementById("respuesta").value = "";
        juegoCapitales();
    }
}


function volver(){
        //MEDIANTE ESTA FUNCIÓN SE VUELVE A LA PANTALLA PRINCIPAL.
        document.getElementById("contenedorTarjetas").style.display = "flex";
        document.getElementById("juegoCapitales").style.display = "none";
        document.getElementById("juegoBanderas").style.display = "none";
        //Se vuelven a inicializar en cero el puntaje y el índice
        indicePreguntaActualCapital = 0;
        puntajeCapital = 0;
        respuestaCorrectasCapital = 0;
        respuestaIncorrectasCapital = 0;
}

/*FIN JUEGO CAPITALES*/

/*JUEGO BANDERAS*/
//SE INICIALIZAN VARIABLES GLOBALES PARA DEFINIR
// INDICES, RESPUESTAS CORRECTAS/ INCORRECTAS.
// SE INCIALIZAN TAMBIÉN CONTADORES

var indiceAleatorioBandera;
var indicePreguntaActualBandera = 0;
var puntajeBandera = 0;
var paisAleatorioBandera;
var capitalAleatorioBandera;
var respuestaCorrectasBandera = 0;
var respuestaIncorrectasBandera = 0;

function juegoBanderas(){
    //ESTA FUNCION GUARDA EN VARIABLES OBJETOS DEL DOM.
    //SI EL INDICE DE PREGUNTA ACTUAL ES 5 MUESTRA MENSAJE FINALIZADO
    // SINO LLAMA LA FUNCIÓN QUE MUESTRA PREGUNTA.

    var contenedorTarjetas = document.getElementById("contenedorTarjetas");
    var detallePais = document.getElementById("detallePais");
    var contJuegBan = document.getElementById("juegoBanderas");
    var contJuegCap = document.getElementById("juegoCapitales");    

    contenedorTarjetas.style.display = "none";
    detallePais.style.display = "none";
    contJuegBan.style.display = "block";
    contJuegCap.style.display = "none";  


    indiceAleatorioBandera = Math.floor(Math.random() * 250);

    if (indicePreguntaActualBandera >= 5) {
        audio.play();
        Swal.fire({

            icon: 'success',
            title: 'Juego terminado',
            text: `Respuestas correctas: ${respuestaCorrectasBandera}; 
            Respuestas incorrectas : ${respuestaIncorrectasBandera}`,
            showConfirmButton: true,

        })
        
        contenedorTarjetas.style.display = "flex";
        contJuegBan.style.display = "none";

        
        //Se vuelven a inicializar en cero el puntaje y el índice
        indicePreguntaActualBandera = 0;
        puntajeBandera = 0;
        respuestaCorrectasBandera = 0;
        respuestaIncorrectasBandera = 0;
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else {
        mostrarBanderaPais(indiceAleatorioBandera, indicePreguntaActualBandera);
    }    
}

function mostrarBanderaPais(indiceAleatorioBandera, indicePreguntaActualBandera){

    // ESTA FUNCION TIENE 2 PARÁMETROS , EL INDICEALEATORIO BANDERA SE USA PARA FILTRAR
    // EL PAIS ALEATORIO, Y EL INDICE PREGUNTA ACTUAL ES PARA SABER EN QUE PREGUNTA DE LAS 5
    // ESTÁ EL USER.
    // TENIENDO EN CUENTA EL PAIS ALEATORIO SE FORMULA LA PREGUNTA
    
    var contJuegBan = document.getElementById("juegoBanderas");    

    paisAleatorio = datosPaises[indiceAleatorioBandera];
    
    var banderaPaisAleatorio = paisAleatorio.bandera;      

    contJuegBan.innerHTML = ` 
    

    <div id="contenedorJuegoBandera" class="card" style="width: 24rem;">
    <img class="card-img-top" src=${banderaPaisAleatorio} alt="Card image cap">
    <div class="card-body">
        <h5 class="card-title">De que pais es esta bandera ?</h5>
        <input type="text" id="respuestaBandera" placeholder="Escribe tu respuesta">
        <button id="enviarRespuesta" onclick="verificarRespuestaBandera()">Enviar respuesta</button>
    </div>
    </div>
    `
}

function verificarRespuestaBandera(){
    // ESTA FUNCION VERIFICA LA RESPUESTA INGRESADA POR EL USUARIO
    // SI LA RESPUESTA ES CORRECTA SUMA 1 EN EL CONTADOR DE LAS CORRECTAS
    // POR EL CONTRARIO SUMA 1 EN EL CONTRADOR DE LAS INCORRECTAS.
    // SI EL USUARIO NO INGRESA NADA MUESTRA MENSAJE DE ERROR.
    
    var respuestaCorrecta = paisAleatorio.nombre;
    var respuestaUsuario = document.getElementById("respuestaBandera").value;

    if (respuestaUsuario === "" || respuestaUsuario === undefined) {        
        Swal.fire({

            icon: 'error',
            title: 'El campo no puede estar vacío ',
            showConfirmButton: true,

        })
    } else {
        if (respuestaUsuario.toLowerCase() !== respuestaCorrecta.toLowerCase()) {            
            respuestaIncorrectasBandera += 1;
        } else {            
            respuestaCorrectasBandera += 1;
        }
        indicePreguntaActualBandera += 1;
        document.getElementById("respuestaBandera").value = "";
        juegoBanderas();
    }
}
/*FIN JUEGO BANDERAS*/
fetchData();


