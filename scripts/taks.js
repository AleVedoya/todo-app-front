// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const jwt = localStorage.getItem("jwt");
if (!jwt) {
  location.replace("index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.querySelector("#closeApp");
  const formCrearTarea = document.querySelector("form.nueva-tarea");
  const nombreUsuario = document.querySelector(".user-info p");
  const contenedorTareasPendientes =
    document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas =
    document.querySelector(".tareas-terminadas");
  const cantidadfinalizadas = document.querySelector("#cantidad-finalizadas");
  const inputTarea = document.querySelector("#nuevaTarea");
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    Swal.fire({
      title: "¿Seguro quiere cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "Cancelar",
      confirmButtonColor: "#333fff",
      cancelButtonColor: "#ff7059ff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        location.replace("index.html");
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const config = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${url}/users/getMe`, config)
      .then((response) => response.json())
      .then((data) => {
        nombreUsuario.textContent = data.firstName;
      })
      .catch((response) => {
        response.status(400).json();
        console.error(response)
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const config = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${url}/tasks`, config)
      .then((response) => response.json())
      .then((data) => {
        renderizarTareas(data);
      })
      .catch((response) => {
        response.status(400).json();
        console.error(response)
      });
  }
  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    const nuevaTarea = {
      description: inputTarea.value,
      completed: false,
    };

    // Solicitud a la API con el method POST

    const config = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(nuevaTarea),
    };

    fetch(`${url}/tasks`, config)
      .then((response) => response.json())
      .then((data) => {
        inputTarea.value = "";

        if (data.description) {
          consultarTareas();
        }
      })
      .catch((response) => {
        response.status(400).json();
        console.error(response)
      });
    formCrearTarea.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    cantidadfinalizadas.textContent = "0";

    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";

    let count = 0;

    listado.forEach((tarea) => {
      if (tarea.completed) {
        count++;
        const fecha = parsedDate(tarea.createdAt);
        const tareaTerminada = `
            <li class="tarea" data-aos="fade-up">
              <div class="hecha">
                <i class="fa-regular fa-circle-check"></i>
              </div>
              <div class="descripcion">
                <p class="nombre">${tarea.description}</p>
                <p class="timestamp" id="${tarea.createdAt}">Creada el: ${fecha}</p>
                <div class="cambios-estados">
                  <button class="change incompleta" id="${tarea.id}" type="button"><i class="fa-solid fa-rotate-left"></i></button>
                  <button class="borrar" id="${tarea.id}" type="button"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
              </li>
              `;
        contenedorTareasTerminadas.innerHTML += tareaTerminada;
      } else {
        const fecha = parsedDate(tarea.createdAt);
        const tareaPendiente = `
            <li class="tarea" data-aos="fade-down">
                <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
                <div class="descripcion">
                  <p class="nombre">${tarea.description}</p>
                  <p class="timestamp" id="${tarea.createdAt}">Creada el: ${fecha}</p>
                  <button class="borrar" id="${tarea.id}" type="button"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </li>
        `;
        contenedorTareasPendientes.innerHTML += tareaPendiente;
      }
    });
    cantidadfinalizadas.textContent = count;

    const botonesChange = document.querySelectorAll(".change");
    const botonesDelete = document.querySelectorAll(".borrar");

    botonesChange.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        botonesCambioEstado(event.target);
      });
    });

    botonesDelete.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        botonBorrarTarea(event.target);
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                FUNCION FECHA                               */
  /* -------------------------------------------------------------------------- */

  function parsedDate(f) {
    const date = new Date(f);
    let day = date.getDate();
    let month = parseInt(date.getMonth()) + 1;
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return day + "/" + month + "/" + date.getFullYear();
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(e) {
    let tarea = {
      completed: !e.classList.contains("incompleta") ? true : false,
    };

    fetch(`${url}/tasks/${e.id}`, {
      method: "PUT",
      body: JSON.stringify(tarea),
      headers: {
        authorization: jwt,
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        consultarTareas();
      })
      .catch((response) => {
        response.status(400).json();
        console.error(response)
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(e) {
    fetch(`${url}/tasks/${e.id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        authorization: jwt,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        consultarTareas();
      })
      .catch((response) => {
        response.status(400).json();
        console.error(response)
      });
  }

  obtenerNombreUsuario();
  consultarTareas();
});
