const multer = require("multer");

const fs = require("fs");
const path = require("path");

// Esta funcion es para obtener la extención
const getFileType = (file) => {
  const mimeType = file.mimetype.split("/");
  return mimeType[mimeType.length - 1];
};

const generateFileName = (req, file, cb) => {
  const extension = getFileType(file);

  // Se genera un nombre para  el file que se va a mandar
  const filename =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + extension;

  //   por ultimo se regresa la callback, con cero errores, el nombre del campo (avatar) y el nombre generado
  cb(null, file.fieldname + "-" + filename);
};

//   Funcion para verificar el tipo de archivo que se manda
const fileFilter = (req, file, cb) => {
  const extension = getFileType(file);

  const allowedType = /jpeg|jpg|png/;

  const passed = allowedType.test(extension);

  if (passed) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
};
exports.userFile = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Se obtiene el id para asi crear una carpeta para cada usuario con su id unico
      const { id } = req.user;
      // Se crea una ruta, que mas adelante se verificará si existe o no
      const dest = `uploads/user/${id}`;

      fs.access(dest, (error) => {
        // Si todavía existe la capeta enotnces hubó un error al momento de querer acceder a la carpeta
        if (error) {
          // Aqui se crea la carpeta con la ruta creada
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          // Si ya existe la carpeta, se lee el contenido de la carpeta
          fs.readdir(dest, (error, files) => {
            if (error) throw error;

            // Se itera por todoe el contenido de la carpeta
            for (const file of files) {
              // Cada file es eliminado de la carpeta
              fs.unlink(path.join(dest, file), (error) => {
                if (error) throw error;
              });
            }
          });

          //   Se regresa la callback en donde la estructura es, que al principio son los errores y despues la respuesta, en este caso se espera que no lleguen errores
          return cb(null, dest);
        }
      });
    },

    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single("avatar");
})();

exports.chatFile = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Se obtiene el id para asi crear una carpeta para cada usuario con su id unico
      const { id } = req.body;
      // Se crea una ruta, que mas adelante se verificará si existe o no
      const dest = `uploads/chat/${id}`;

      fs.access(dest, (error) => {
        // Si todavía existe la capeta enotnces hubó un error al momento de querer acceder a la carpeta
        if (error) {
          // Aqui se crea la carpeta con la ruta creada
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          //   Se regresa la callback en donde la estructura es, que al principio son los errores y despues la respuesta, en este caso se espera que no lleguen errores
          return cb(null, dest);
        }
      });
    },

    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single("image");
})();
