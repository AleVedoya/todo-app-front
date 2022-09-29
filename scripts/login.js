// Evaluamos si ya hay un jwt
const jwt = localStorage.getItem("jwt");

if (jwt) {
  location.replace("mis-tareas.html");
}

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector("form");
  const inputEmail = document.querySelector("#inputEmail");
  const inputPass = document.querySelector("#inputPassword");
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const datosUsuario = {
      email: inputEmail.value,
      password: inputPass.value,
    };
    realizarLogin(datosUsuario);
    form.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(datosUsuario) {
    const config = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(datosUsuario),
    };
    fetch(`${url}/users/login`, config)
      .then((response) => {
        if (response.status === 404) {
          Swal.fire("El usuario no existe");
        } else if (response.status === 400) {
          Swal.fire("Usuario o contraseña incorrecto");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        if (data.jwt) {
          // Guardo el token
          localStorage.setItem("jwt", data.jwt);
          // localStorage.setItem("jwt", JSON.stringify(data.jwt));
          location.replace("mis-tareas.html");
        }
      })
      .catch((response) => {
        console.error(response);
      });
  }
});

/* -------------------------------------------------------------------------- */
/*                                  MENSAJES                                  */
/* -------------------------------------------------------------------------- */

// 200 => Operación Exitosa. Retorna un JWT.
// 400 => Contraseña incorrecta
// 404 => El usuario no existe
// 500 => Error del servidor

/* -------------------------------------------------------------------------- */
/*                             DATOS PARA INGRESAR                            */
/* -------------------------------------------------------------------------- */

// jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZWphbmRyYXZlZG95YUBob3RtYWlsLmNvbSIsImlkIjo2NDIsImlhdCI6MTY2NDI3OTY5N30.yE1LGuLvUaXKTZ_j9i-qaMDhecz-gbQjVbaeJs0iWC4
//email: alejandravedoya@hotmail.com
//password: 4444

// jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im51ZXZvdXN1YXJpb0BtYWlsLmNvbSIsImlkIjo3MjAsImlhdCI6MTY2NDM3NjI4M30.Z6Iq7ojzjs3N5iLBWbvqHF8IZPvDa2rnzsunXCruTUU
//email: nuevousuario@mail.com
//password: 1234
