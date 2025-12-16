import express from 'express';
import multer from 'multer';
import path from 'path';
import rateLimit from 'express-rate-limit';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { protect, editor } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/* ---------------- R2 Client ---------------- */
const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

/* ---------------- Rate Limit ---------------- */
// จำกัด upload: 10 ครั้ง / 10 นาที / IP
const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { message: 'Upload too many times, slow down.' },
});

/* ---------------- Multer ---------------- */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image type'), false);
        }
    },
});

/* ---------------- Route ---------------- */
// POST /api/upload
router.post(
    '/',
    protect,
    editor,
    uploadLimiter,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            /* ---------- Sharp: แปลง + ลดขนาด ---------- */
            const imageBuffer = await sharp(req.file.buffer)
                .resize({
                    width: 1600,           // จำกัดความกว้าง
                    withoutEnlargement: true,
                })
                .webp({ quality: 80 })     // แปลงเป็น webp
                .toBuffer();

            const filename = `uploads/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}.webp`;

            /* ---------- Upload to R2 ---------- */
            await r2.send(
                new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: filename,
                    Body: imageBuffer,
                    ContentType: 'image/webp',
                })
            );

            const imageUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

            res.json({ url: imageUrl });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Upload failed' });
        }
    }
);

export default router;
