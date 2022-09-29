window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const inputNombre = document.querySelector("#inputNombre");
  const inputApellido = document.querySelector("#inputApellido");
  const inputEmail = document.querySelector("#inputEmail");
  const inputPassword = document.querySelector("#inputPassword");
  const inputPasswordRepetida = document.querySelector(
    "#inputPasswordRepetida"
  );
  const form = document.querySelector("form");
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar que los dos password sean iguales

    let email = normalizarEmail(inputEmail.value);
    let nombre = normalizarTexto(inputNombre.value);
    let apellido = normalizarTexto(inputApellido.value);
    let password = validarContrasenia(inputPassword.value);
    let password2 = validarContrasenia(inputPasswordRepetida.value);

    if (!validarTexto(nombre) || !validarTexto(apellido)) {
      Swal.fire("No puedes dejar campos vacíos");
    } else if (!validarEmail(email)) {
      Swal.fire("Debes ingresar un email válido");
    } else if (
      !validarContrasenia(inputPassword.value) ||
      !validarContrasenia(inputPasswordRepetida.value)
    ) {
      Swal.fire("Los campos de contraseña no deben estar vacíos");
    } else if (
      !compararContrasenias(inputPassword.value, inputPasswordRepetida.value)
    ) {
      Swal.fire("Las contraseñas ingresadas deben ser iguales");
    } else {
      const datosUsuario = {
        firstName: nombre,
        lastName: apellido,
        email: email,
        password: password,
      };

      realizarRegister(datosUsuario);
    }
    form.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(datosUsuario) {
    fetch(`${url}/users`, {
      method: "POST",
      body: JSON.stringify(datosUsuario),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 400) {
          Swal.fire("Este email ya se encuentra registrado, elija otro");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.jwt) {
          // Guardo el token
          localStorage.setItem("jwt", data.jwt);
          // localStorage.setItem("jwt", JSON.stringify(data.jwt));
          location.replace("mis-tareas.html");
        }
      })
      .catch((response) => {
        response.status(400).json();
        console.error(message);
      });
  }
});
/* -------------------------------------------------------------------------- */
/*                                   MENSAJES                                  */
/* -------------------------------------------------------------------------- */

// 200 => Operación Exitosa. Retorna un JWT
// 400 => El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto
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
