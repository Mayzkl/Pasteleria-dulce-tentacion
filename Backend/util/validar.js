const validator = require("validator");

const validarArticulo = (parametros) => {

    let validar_titulo = !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 5, max: 50 });

    let validar_tamaño = !validator.isEmpty(parametros.tamaño) &&
        ["10 personas", "15 personas", "20 personas"].includes(parametros.tamaño);   
    
    let validar_relleno = !validator.isEmpty(parametros.relleno) &&
        ["Manjar", "Crema", "Chocolate"].includes(parametros.relleno);  

    let validar_precio = !validator.isEmpty(parametros.precio.toString()) &&
        validator.isNumeric(parametros.precio.toString());

    let validar_mensaje = true;
    if (parametros.mensaje && parametros.mensaje.trim() !== "") {
        validar_mensaje = validator.isLength(parametros.mensaje, { max: 40 });
    }    

    if (!validar_titulo || !validar_tamaño|| !validar_relleno|| !validar_precio || !validar_mensaje) {
        throw new Error("No se ha validado la información !!");
    }
}

const validarIdArticulo = (id) => {
    let validar_id = !validator.isEmpty(id) &&
        validator.isLength(id, { min: 24, max: 24 });

    if (!validar_id) {
        throw new Error("No se ha validado el ID!!");
    }
}

const validarUsuario = (parametros) => {

    let validar_nombre = !validator.isEmpty(parametros.nombre) &&
        validator.isLength(parametros.nombre, { min: 3, max: 50 });

    let validar_email = !validator.isEmpty(parametros.email) &&
        validator.isLength(parametros.email);
        
    let validar_password = !validator.isEmpty(parametros.password) && 
        validator.isLength(parametros.password, { min: 8, max: 20 });

    if (!validar_nombre || !validar_email || !validar_password) {
        throw new Error("No se ha validado la información del usuario!!");
    }
}

const validarNombreUsuario = (nombre) => {
    let validar_nombre = !validator.isEmpty(nombre) &&
        validator.isLength(nombre, { min: 5, max: undefined });

    if (!validar_nombre) {
        throw new Error("No se ha validado el nombre!");
    }
}

const validarIdUsuario = (id) => {
    let validar_id = !validator.isEmpty(id) &&
        validator.isLength(id, { min: 24, max: 24 });

    if (!validar_id) {
        throw new Error("No se ha validado el ID!!");
    }
}

module.exports = {
    validarArticulo,
    validarIdArticulo,
    validarUsuario,
    validarNombreUsuario,
    validarIdUsuario
}
