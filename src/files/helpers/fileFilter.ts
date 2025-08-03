export const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    
    if (!file) {
        req['fileError'] = 'Sin Archivo Seleccionado';
        return cb(null, false);
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'];

    if (validExtensions.includes(fileExtension)) {
        return cb(null, true);
    }

    req['fileError'] = 'Archivo Inválido de Imagen';
    cb(null, false);
};