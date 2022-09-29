/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  return texto === "" ? false : true;
}

function normalizarTexto(texto) {
  return texto.trim();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  let regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  if (email === "") {
    return false
  }

  if (regex.test(email)) {
    return true;
  } else {
    return false
  }

}

function normalizarEmail(email) {
  return email = email.trim();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  return contrasenia === "" ? false : true;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
   return contrasenia_1 === contrasenia_2 ? true : false;
}