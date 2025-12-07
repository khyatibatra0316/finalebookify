import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for book files and cover images
const fileFilter = (req, file, cb) => {
    // Allow PDF and EPUB for book files
    const bookFileTypes = ['.pdf', '.epub'];
    // Allow common image formats for cover images
    const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    const ext = path.extname(file.originalname).toLowerCase();

    // Check based on field name
    if (file.fieldname === 'bookFile') {
        if (bookFileTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Book file must be PDF or EPUB'), false);
        }
    } else if (file.fieldname === 'coverImage') {
        if (imageTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Cover image must be JPG, PNG, GIF, or WebP'), false);
        }
    } else {
        // Allow other fields
        cb(null, true);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

export default upload;
