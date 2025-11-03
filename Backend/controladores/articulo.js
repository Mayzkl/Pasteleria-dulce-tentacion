const fs = require("fs");
const path = require("path");
const { validarArticulo, validarIdArticulo } = require("../util/validar");
const Articulo = require("../modelos/Articulo");


const crear = (req, res) => {

    let parametros = req.body;

    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    const articulo = new Articulo(parametros);

    articulo.save();

    return res.status(200).json({
        status: "éxito",
        articulo: parametros,
        mensaje: "Artículo creado con éxito!!"
    })

}

const listar = async (req, res) => {

    try {
        let consulta = Articulo.find({});

        if (req.params.ultimos) {
            consulta.limit(req.params.ultimos);
        }

        let resultado = await consulta.sort({ fecha: -1 });

        if (!resultado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos!!"
            });
        } else {
            return res.status(200).send({
                status: "éxito",
                contador: resultado.length,
                resultado
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se encuentran artículos!!"
        });
    }
}

const listar_uno = async (req, res) => {
    let id = req.params.id;
    try {
        validarIdArticulo(id);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Id con formato incorrecto"
        });
    }

    try {
        let resultado = await Articulo.findById(id);
        if (!resultado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado el artículo"
            });
        } else {
            return res.status(200).json({
                status: "éxito",
                resultado
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se han encontrado el artículo"
        });
    }
}

const borrar = async (req, res) => {

    try {
        let articuloId = req.params.id;
        validarIdArticulo(articuloId);
        let resultado = await Articulo.findOneAndDelete({ _id: articuloId });

        if (!resultado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el artículo"
            });
        } else {
            return res.status(200).json({
                status: "éxito",
                articulo: resultado,
                mensaje: "Artículo borrado"
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha podido borrar el artículo, posiblemente el formato de ID es incorrecto!!"
        });
    }
}

const editar = async (req, res) => {
    let articuloId = req.params.id;

    let parametros = req.body;

    try {
        validarArticulo(parametros);
        let resultado = await Articulo.findOneAndUpdate({ _id: articuloId }, req.body, { new: true });

        if (!resultado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar el artículo"
            });
        } else {
            return res.status(200).json({
                status: "éxito",
                articulo: resultado,
                mensaje: "Artículo actualizado!!"
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

}

const subir = async (req, res) => {

    try {
        if (!req.file && !req.files) {
            return res.status(404).json({
                status: "error",
                mensaje: "Petición invalida"
            });
        }

        let archivo = req.file.originalname;

        let archivo_split = archivo.split("\."); 

        let extension = archivo_split[1];
        if (extension != "png" && extension != "jpg" &&
            extension != "jpeg" && extension != "gif") {
            fs.unlink(req.file.path, (error) => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Imagen invalida"
                });
            })
        } else {
            let articuloId = req.params.id;
            let resultado = await Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true });
            if (!resultado) {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Error al actualizar"
                });
            } else {
                return res.status(200).json({
                    status: "éxito",
                    articulo: resultado,
                    fichero: req.file
                })
            }

        }
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al actualizar!"
        });
    }

}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            });
        }
    })
}

const buscador = async (req, res) => {
    let busqueda = req.params.busqueda; 
    let consulta = Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } },
        ]
    });

    let resultado = await consulta.sort({ fecha: -1 });


    if (!resultado || resultado.length <= 0) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado artículos"
        });
    }
    else {

        return res.status(200).json({
            status: "éxito",
            articulos: resultado
        });
    }

}

const editarArticulo = async (req, res) => {
    try {
        const articuloId = req.params.id;
        const nuevosDatos = req.body;

        const articuloExistente = await Articulo.findById(articuloId);
        if (!articuloExistente) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo a editar"
            });
        }

        const articuloActualizado = await Articulo.findByIdAndUpdate(
            articuloId,
            nuevosDatos,
            { new: true } 
        );

        return res.status(200).json({
            status: "éxito",
            mensaje: "Artículo actualizado correctamente",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al actualizar el artículo",
            error: error.message
        });
    }
};

const eliminarArticulo = async (req, res) => {
    try {
        const articuloId = req.params.id;

        const articuloEliminado = await Articulo.findByIdAndDelete(articuloId);

        if (!articuloEliminado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo a eliminar"
            });
        }

        return res.status(200).json({
            status: "éxito",
            mensaje: "Artículo eliminado correctamente",
            articulo: articuloEliminado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar el artículo",
            error: error.message
        });
    }
};

module.exports = {
    crear,
    listar,
    listar_uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador,
    editarArticulo,
    eliminarArticulo
}
