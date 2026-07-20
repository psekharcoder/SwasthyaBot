const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );

    }

});

// Allowed File Types
const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "application/pdf",

        "text/plain",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "image/jpeg",

        "image/png"

    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(new Error("Unsupported file type"), false);

    }

};

const upload = multer({

    storage,

    fileFilter

});

module.exports = upload;