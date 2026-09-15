# Image API (Cloudinary based)

Ye aapki Cloudinary account (kglhkyhn) se judi hui API hai. Credentials pehle se `.env` file mein daale hue hain.

## Setup (sirf ek baar karna hai)

### 1. Dependencies install karo
Is folder ko kisi jagah save karo (jaise Desktop par "image-api" naam se), phir us folder ke andar Command Prompt kholo aur:
```bash
npm install
```

### 2. Server start karo
```bash
npm start
```
Terminal mein likha aayega: `Image API running on http://localhost:3000`

## Test karo

Browser mein jao: `http://localhost:3000/images`

Isse aapki saari Cloudinary images ki list JSON format mein dikhni chahiye.

## API Endpoints

| Method | Endpoint | Kaam |
|--------|----------|------|
| GET | `/images` | Saari images ki list |
| GET | `/images/:id` | Ek image ki details |
| POST | `/images/upload` | Nayi image upload karo |
| DELETE | `/images/:id` | Image delete karo |

### Example: Nayi image upload karo
```bash
curl -X POST http://localhost:3000/images/upload -F "image=@C:\path\to\photo.jpg"
```

## ⚠️ Security note

`.env` file mein aapki asli Cloudinary API Secret hai. Ise:
- Kisi ke saath share mat karo
- GitHub jaisi public jagah kabhi upload mat karo
- Agar leak ho jaye, toh Cloudinary Dashboard → API Keys → "Generate New API Key" se naya bana lo

## Deploy kaise karo (free, internet par live karne ke liye)

- **Render.com** ya **Railway.app** par free deploy ho jaata hai
- GitHub repo connect karo, environment variables (.env wali 3 values) unke dashboard mein daal do, deploy button dabao
