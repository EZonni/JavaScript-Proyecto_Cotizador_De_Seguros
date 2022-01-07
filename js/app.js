// Constructores

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};

// Cotización con los datos.

Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case `1`:
            cantidad = base*1.15;
            break;
        case `2`:
            cantidad = base*1.05;
            break;
        case `3`:
            cantidad = base*1.35;
            break;
        default:
            break;
    };

    //Leer el año   -----   El costo se reducirá un 3% por año de antiguedad.

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Básico: Se multiplica por 30% más.
        Completo: Se multiplica por 50% más.
    */

    if(this.tipo === `basico`) {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    };

    return cantidad;
};

function UI() {};

// Llenar las opciones de los años seleccionables.

UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max -20;
    const selectYear = document.querySelector(`#year`);
    
    for(let i = max; i > min; i--) {
        let option = document.createElement(`option`);
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
};

// Mostrar alertas en pantalla

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement(`div`);

    if(tipo === `error`) {
        div.classList.add(`error`);
    } else {
        div.classList.add(`correcto`);
    };

    div.classList.add(`mensaje`, `mt-10`);
    div.textContent = mensaje;

    //Insertarlo en el HTML.
    const formulario = document.querySelector(`#cotizar-seguro`);
    formulario.insertBefore(div, document.querySelector(`#resultado`));

    setTimeout(() => {
        div.remove();
    }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo} = seguro;
    let nombreMarca;
    switch(marca) {
        case `1`:
            nombreMarca = `Americano`;
            break;
        case `2`:
            nombreMarca = `Asiatico`;
            break;
        case `3`:
            nombreMarca = `Europeo`;
            break;
        default:
            break;
    };

    //Crear el resultado.
    const div = document.createElement(`div`);
    div.classList.add(`mt-10`);

    div.innerHTML = `
        <p class="header">Tu resumen<p/>
        <p class="font-bold">Marca: <span class="font-normal"> ${nombreMarca}<p/>
        <p class="font-bold">Año: <span class="font-normal"> ${year}<p/>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}<p/>
        <p class="font-bold">Total: <span class="font-normal"> $${total}<p/>
    `;
    const resultadoDiv = document.querySelector(`#resultado`);

    //Mostrar spinner.
    const spinner = document.querySelector(`#cargando`);
    spinner.style.display = `block`;

    setTimeout(() => {
        spinner.style.display = `none`;     //Se borra el spinner.
        resultadoDiv.appendChild(div);     //Se muestra el resultado.
    }, 3000);
};

// Instanciar UI
const ui = new UI();

document.addEventListener(`DOMContentLoaded`, () => {
    ui.llenarOpciones(); //Llena el select con los años.
});


// Eventos

eventListeners();

function eventListeners() {
    const formulario = document.querySelector(`#cotizar-seguro`);
    formulario.addEventListener(`submit`, cotizarSeguro);
};

function cotizarSeguro(e) {
    e.preventDefault();

    //Leer la marca seleccionada.
    const marca = document.querySelector(`#marca`).value;


    //Leer el año seleccionado.
    const year = document.querySelector(`#year`).value;

    //Leer la cobertura seleccionada.
    const tipo = document.querySelector(`input[name="tipo"]:checked`).value;

    if(marca === `` || year === `` || tipo === ``) {
        ui.mostrarMensaje(`Todos los campos son obligatorios`, `error`);
        return;
    };

    ui.mostrarMensaje(`Cotizando...`, `exito`);

    //Ocultar las cotizaciones previas.
    const resultados = document.querySelector(`#resultado div`);
    if(resultados != null) {
        resultados.remove();
    }

    //Instanciar el seguro.
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Prototype para cotizar.
    ui.mostrarResultado(total, seguro);
};