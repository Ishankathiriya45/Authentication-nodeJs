const multer = require("multer");
const path = require('path')

const bike_image = multer.diskStorage({
    destination: function (req, file, cb) {

        const allowedExtension = ["jpg", "png", "jpeg", "svg"];
        const extensions = path.extname(file.originalname).toLowerCase();
        const isAllowed = allowedExtension.includes(extensions.substring(1));
        let paths;

        if (file.fieldname == 'bike_image') {
            paths = 'public/bike';
        } else {
            paths = 'public';
        }

        if (isAllowed) {
            cb(null, paths)
        } else {
            cb(new Error('File type not allowed'), false)
        }
    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: bike_image })

module.exports = {
    upload,
}