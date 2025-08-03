import { v4 as uuid } from "uuid";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, cb: Function ) => {

    if (!file) {
        req['fileError'] = 'Sin Archivo Seleccionado';
        return cb(null, false);
    }

    const fileExtension = file.mimetype.split('/')[1]
    const fileName = `${uuid()}.${fileExtension}`

    cb(null, fileName)
};