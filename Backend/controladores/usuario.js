const Usuario = require("../modelos/Usuario");

// Crear usuario 
const crear_usuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos (nombre, email o password)",
            });
        }

        // ¿Ya existe ese email?
        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({
                status: "error",
                mensaje: "El correo ya está registrado",
            });
        }

        const nuevo = new Usuario({ nombre, email, password });
        await nuevo.save();

        return res.status(201).json({
            status: "success",
            mensaje: "Usuario creado correctamente",
            usuario: nuevo,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al crear usuario",
        });
    }
};

// Listar todos los usuarios
const listar_usuario = async (req, res) => {
    try {
        const usuarios = await Usuario.find().sort({ nombre: 1 });
        return res.status(200).json({
            status: "success",
            usuarios,
        });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al listar usuarios",
        });
    }
};

// Obtener un solo usuario por ID
const listar_un_usuario = async (req, res) => {
    try {
        const id = req.params.id;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            status: "success",
            usuario,
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al obtener usuario",
        });
    }
};

// Editar usuario por ID
const editar_usuario = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, email, password } = req.body;

        const datosActualizados = {};
        if (nombre) datosActualizados.nombre = nombre;
        if (email) datosActualizados.email = email;
        if (password) datosActualizados.password = password;

        const usuario = await Usuario.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado para editar",
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Usuario actualizado",
            usuario,
        });
    } catch (error) {
        console.error("Error al editar usuario:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al editar usuario",
        });
    }
};

// Borrar usuario por ID
const borrar_usuario = async (req, res) => {
    try {
        const id = req.params.id;

        const usuario = await Usuario.findByIdAndDelete(id);

        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado para borrar",
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Usuario eliminado",
        });
    } catch (error) {
        console.error("Error al borrar usuario:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al borrar usuario",
        });
    }
};

// Login de usuario
const login_usuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                mensaje: "Debes enviar email y contraseña",
            });
        }

        const usuario = await Usuario.findOne({ email });

        if (!usuario || usuario.password !== password) {
            return res.status(401).json({
                status: "error",
                mensaje: "Credenciales incorrectas",
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Login correcto",
            usuario,
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al iniciar sesión",
        });
    }
};

module.exports = {
    crear_usuario,
    listar_usuario,
    listar_un_usuario,
    borrar_usuario,
    editar_usuario,
    login_usuario,
};
