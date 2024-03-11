const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();
  //Validar
  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    //Hubo un error
    mostrarError("Ambos campos son obligatorios");
    return;
  }
  //Consultamos la API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    //Crear Alerta
    //Crear alerta por medio de scripting
    const alerta = document.createElement("div");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    alerta.innerHTML = ` <b>
        Error!       
        </b>
        <spam class="block">${mensaje}</spam>
        `;

    container.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI(c, p) {
  const appId = "6d712ae3a528bea569c71c19e41dd613";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${c},${p}&appid=${appId}`;
  //muestra un spinner recarga

  Spinner();
  setTimeout(() => {
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        // console.log(datos.main.temp/10);
        limpiarHTML(); // Limpiar html
        if (datos.cod === "404") {
          mostrarError("Ciudad no encontrada");
          return;
        }
        //Imprime la respuesta en el HTML
        mostrarResultado(datos);
      });
  }, 1500);
}

function mostrarResultado(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos; //aplicamos doble destructuring
  //const temp = datos.main.temp/10;

  const celcius = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add("text-2xl");
  //temperatura maxima
  const tempMaxima = document.createElement("p");
  tempMaxima.innerHTML = `Max: ${max} &#8451`;
  tempMaxima.classList.add("text-xl");

  //temperatura minima
  const tempMinima = document.createElement("p");
  tempMinima.innerHTML = `Min: ${min} &#8451`;
  tempMinima.classList.add("text-xl");

  const actual = document.createElement("p");
  actual.innerHTML = `${celcius} &#8451`;
  actual.classList.add("font-bold", "text-6xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");

  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}
//funciones breves que hacen una sola accion
const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
  //Esto va a limpiar el resultado para que solo se muestre uno
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");

  divSpinner.innerHTML = `<div class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  </div>`;

  resultado.appendChild(divSpinner);
}
