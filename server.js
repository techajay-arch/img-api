const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const app = express();

// Allow gallery.html (opened as a local file) to fetch from this server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json());

// ---- Cloudinary config (values come from .env file) ----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: temporarily hold uploaded file in memory before sending to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

/**
 * GET /images
 * Returns list of all images in your Cloudinary account (with pagination via ?next_cursor=)
 */
app.get('/images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      next_cursor: req.query.next_cursor || undefined,
    });

    const images = result.resources.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
      width: img.width,
      height: img.height,
      format: img.format,
      created_at: img.created_at,
    }));

    res.json({
      count: images.length,
      next_cursor: result.next_cursor || null,
      images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

/**
 * GET /images/:id
 * Returns a single image's details by its public_id
 */
app.get('/images/:id(*)', async (req, res) => {
  try {
    const result = await cloudinary.api.resource(req.params.id);
    res.json({
      id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      created_at: result.created_at,
    });
  } catch (err) {
    res.status(404).json({ error: 'Image not found' });
  }
});

/**
 * POST /images/upload
 * Upload a new image. Send as multipart/form-data with field name "image"
 */
app.post('/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided (field name should be "image")' });
    }

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({}, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.file.buffer);
      });

    const result = await uploadFromBuffer();

    res.status(201).json({
      id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * DELETE /images/:id
 * Delete an image by its public_id
 */
app.delete('/images/:id(*)', async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.id);
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image API running on http://localhost:${PORT}`);
});
