import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
} // ensure the uploads directory exists

// multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// file filter to allow only images
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

// Helper to only run multer when the request is multipart/form-data.
// This prevents errors when clients send JSON bodies instead of form-data.
export const optionalSingle = (fieldName) => (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
        return upload.single(fieldName)(req, res, next);
    }
    next();
};

export default upload;